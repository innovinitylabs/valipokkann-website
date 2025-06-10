whats import os
import yaml
from PIL import Image, ExifTags, ImageOps
from datetime import datetime
import pillow_heif
import logging
from pathlib import Path
import shutil
from typing import Dict, Any, Optional, List, Tuple
import piexif
from tqdm import tqdm
import sys
import math
from fractions import Fraction
from PIL.TiffImagePlugin import IFDRational

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define your project's root directory and relevant paths
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
PHOTOGRAPHS_DIR = os.path.join(PROJECT_ROOT, 'public', 'photographs')
OUTPUT_DIR = os.path.join(PROJECT_ROOT, 'src', 'data', 'photography')
FALLBACK_IMAGE = '/valipokkann_transparent_logo.png'
OPTIMIZED_DIR = os.path.join(PHOTOGRAPHS_DIR, 'optimized')

# Ensure directories exist
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(OPTIMIZED_DIR, exist_ok=True)

# List of EXIF tags to ignore (especially location data)
EXIF_IGNORE_TAGS = [
    'GPSInfo', 'GPSLatitudeRef', 'GPSLatitude', 'GPSLongitudeRef', 'GPSLongitude',
    'GPSAltitudeRef', 'GPSAltitude', 'GPSTimeStamp', 'GPSDateStamp',
    'GPSProcessingMethod', 'GPSVersionID', 'SubSecTimeOriginal', 'SubSecTimeDigitized',
    'OffsetTime', 'OffsetTimeOriginal', 'OffsetTimeDigitized'
]

# Mapping common EXIF tags to our Photograph interface fields
EXIF_MAPPING = {
    'Make': 'make',
    'Model': 'model',
    'FocalLengthIn35mmFilm': 'focalLength',
    'FNumber': 'aperture',
    'ExposureTime': 'shutterSpeed',
    'ISOSpeedRatings': 'iso',
    'LensModel': 'lens',
    'DateTimeOriginal': 'dateTaken',
}

def strip_gps_from_exif_bytes(exif_bytes):
    try:
        exif_dict = piexif.load(exif_bytes)
        # Remove GPS IFD
        exif_dict['GPS'] = {}
        # Remove GPS-related tags from 0th and Exif IFDs if present
        for ifd in ['0th', 'Exif']:
            tags_to_remove = []
            for tag, value in exif_dict[ifd].items():
                tag_name = piexif.TAGS[ifd][tag]["name"] if tag in piexif.TAGS[ifd] else str(tag)
                if tag_name.startswith('GPS') or tag_name in [
                    'GPSInfo', 'GPSLatitudeRef', 'GPSLatitude', 'GPSLongitudeRef', 'GPSLongitude',
                    'GPSAltitudeRef', 'GPSAltitude', 'GPSTimeStamp', 'GPSDateStamp',
                    'GPSProcessingMethod', 'GPSVersionID', 'SubSecTimeOriginal', 'SubSecTimeDigitized',
                    'OffsetTime', 'OffsetTimeOriginal', 'OffsetTimeDigitized']:
                    tags_to_remove.append(tag)
            for tag in tags_to_remove:
                del exif_dict[ifd][tag]
        return piexif.dump(exif_dict)
    except Exception as e:
        logger.warning(f"Failed to strip GPS from EXIF: {e}")
        return exif_bytes

def convert_heic_to_jpeg(input_path: str, output_path: str) -> bool:
    """Converts HEIC file to JPEG while preserving EXIF data (except GPS/location)."""
    try:
        heif_file = pillow_heif.open_heif(input_path)
        if not heif_file:
            logger.error(f"Could not open HEIF file {input_path}")
            return False
        exif_bytes = None
        if "exif" in heif_file.info:
            exif_bytes = heif_file.info["exif"]
            logger.debug(f"Found EXIF in heif_file.info for {input_path}")
        elif hasattr(heif_file, 'metadata'):
            for metadata in heif_file.metadata:
                if metadata.get('type') == 'Exif' and metadata.get('data'):
                    exif_bytes = metadata['data']
                    logger.debug(f"Found EXIF in metadata for {input_path}")
                    break
        if not exif_bytes:
            logger.warning(f"No EXIF data found in HEIF file {input_path}")
            return False
        # Strip GPS/location data
        exif_bytes = strip_gps_from_exif_bytes(exif_bytes)
        # Use only the correct attributes for PIL image construction
        try:
            image = Image.frombytes(
                heif_file.mode,
                heif_file.size,
                heif_file.data,
                'raw',
                heif_file.mode,
                heif_file.stride
            )
        except Exception as e:
            logger.error(f"Failed to create PIL image from HEIF: {e}")
            return False
        if image.mode in ('RGBA', 'P'):
            image = image.convert('RGB')

        # Apply EXIF orientation using ImageOps.exif_transpose
        try:
            exif_dict = piexif.load(exif_bytes)
            logger.debug(f"EXIF dictionary after loading for {input_path}: {exif_dict.keys()}")
            if '0th' in exif_dict and piexif.ImageIFD.Orientation in exif_dict['0th']:
                orientation = exif_dict['0th'][piexif.ImageIFD.Orientation]
                logger.debug(f"Original Orientation for {input_path}: {orientation}")
                logger.debug(f"Image size before rotation: {image.size}")

                image = ImageOps.exif_transpose(image)

                # Reset orientation tag after rotating
                exif_dict['0th'][piexif.ImageIFD.Orientation] = 1
                exif_bytes = piexif.dump(exif_dict)
                logger.debug(f"Image size after rotation: {image.size}")
                logger.debug(f"Orientation set to 1 for {input_path}")
        except Exception as e:
            logger.warning(f"Failed to apply EXIF orientation: {e}")

        try:
            image.save(output_path, 'JPEG', quality=95, exif=exif_bytes)
            logger.debug(f"Saved JPEG with EXIF (GPS stripped) for {input_path}")
        except Exception as save_error:
            logger.warning(f"Failed to save with EXIF bytes: {save_error}")
            try:
                exif_dict = piexif.load(exif_bytes)
                exif_bytes2 = piexif.dump(exif_dict)
                image.save(output_path, 'JPEG', quality=95, exif=exif_bytes2)
                logger.debug(f"Saved JPEG with piexif-processed EXIF (GPS stripped) for {input_path}")
            except Exception as piexif_error:
                logger.error(f"Failed to save with piexif: {piexif_error}")
                return False
        if not verify_exif_preservation(input_path, output_path):
            logger.error(f"EXIF verification failed after conversion for {input_path}")
            return False
        return True
    except Exception as e:
        logger.error(f"Failed to convert HEIC to JPEG {input_path}: {e}")
        return False

def optimize_image(input_path: str, output_path: str, max_size: tuple = (1920, 1920)) -> bool:
    """Optimizes an image for web use while preserving EXIF data (except GPS/location)."""
    try:
        if input_path.lower().endswith(('.heic', '.heif')):
            temp_jpeg = output_path + '.temp.jpg'
            if not convert_heic_to_jpeg(input_path, temp_jpeg):
                return False
            image = Image.open(temp_jpeg)
            exif_bytes = None
            try:
                exif_bytes = image.info.get('exif')
                if exif_bytes:
                    exif_bytes = strip_gps_from_exif_bytes(exif_bytes)
                else:
                    logger.warning(f"No EXIF data found in temporary JPEG {temp_jpeg}")
            except Exception as exif_error:
                logger.warning(f"Failed to extract EXIF from temporary JPEG: {exif_error}")
            
            # Generate multiple sizes
            sizes = {
                'thumb': (400, 400),
                'medium': (800, 800),
                'large': (1200, 1200),
                'full': max_size
            }
            
            base_path = os.path.splitext(output_path)[0]
            
            for size_name, size in sizes.items():
                # Resize image
                ratio = min(size[0] / image.size[0], size[1] / image.size[1])
                if ratio < 1:
                    new_size = tuple(int(dim * ratio) for dim in image.size)
                    resized = image.resize(new_size, Image.Resampling.LANCZOS)
                else:
                    resized = image
                
                # Save JPEG version
                jpeg_path = f"{base_path}_{size_name}.jpg"
                if exif_bytes:
                    resized.save(jpeg_path, 'JPEG', quality=85, optimize=True, exif=exif_bytes)
                else:
                    resized.save(jpeg_path, 'JPEG', quality=85, optimize=True)
                
                # Save WebP version
                webp_path = f"{base_path}_{size_name}.webp"
                resized.save(webp_path, 'WEBP', quality=85, method=6)
                
                # Generate blur-up thumbnail
                if size_name == 'thumb':
                    blur_path = f"{base_path}_blur.jpg"
                    blur_size = (20, 20)
                    blur = resized.resize(blur_size, Image.Resampling.LANCZOS)
                    blur.save(blur_path, 'JPEG', quality=30)
            
            try:
                os.remove(temp_jpeg)
            except Exception as e:
                logger.warning(f"Failed to remove temporary file {temp_jpeg}: {e}")
            
            return True
        else:
            image = Image.open(input_path)
            exif_bytes = image.info.get('exif')
            if exif_bytes:
                exif_bytes = strip_gps_from_exif_bytes(exif_bytes)
            if image.mode in ('RGBA', 'P'):
                image = image.convert('RGB')
            
            # Generate multiple sizes
            sizes = {
                'thumb': (400, 400),
                'medium': (800, 800),
                'large': (1200, 1200),
                'full': max_size
            }
            
            base_path = os.path.splitext(output_path)[0]
            
            for size_name, size in sizes.items():
                # Resize image
                ratio = min(size[0] / image.size[0], size[1] / image.size[1])
                if ratio < 1:
                    new_size = tuple(int(dim * ratio) for dim in image.size)
                    resized = image.resize(new_size, Image.Resampling.LANCZOS)
                else:
                    resized = image
                
                # Save JPEG version
                jpeg_path = f"{base_path}_{size_name}.jpg"
                if exif_bytes:
                    resized.save(jpeg_path, 'JPEG', quality=85, optimize=True, exif=exif_bytes)
                else:
                    resized.save(jpeg_path, 'JPEG', quality=85, optimize=True)
                
                # Save WebP version
                webp_path = f"{base_path}_{size_name}.webp"
                resized.save(webp_path, 'WEBP', quality=85, method=6)
                
                # Generate blur-up thumbnail
                if size_name == 'thumb':
                    blur_path = f"{base_path}_blur.jpg"
                    blur_size = (20, 20)
                    blur = resized.resize(blur_size, Image.Resampling.LANCZOS)
                    blur.save(blur_path, 'JPEG', quality=30)
            
            return True
    except Exception as e:
        logger.error(f"Failed to optimize {input_path}: {e}")
        return False

def _convert_rational(value, as_fraction_string: bool = False) -> Any:
    """Helper to convert rational numbers (tuples or IFDRational) to float or fraction string."""
    if isinstance(value, IFDRational):
        try:
            value = (value.numerator, value.denominator)
        except AttributeError:
            return value # Cannot extract numerator/denominator, return as is

    if isinstance(value, tuple) and len(value) == 2:
        try:
            numerator, denominator = value
            if denominator == 0:
                return 0.0 # Avoid ZeroDivisionError

            if as_fraction_string:
                if numerator == 1:
                    return f"1/{denominator}s"
                else:
                    f = Fraction(numerator, denominator).limit_denominator()
                    return f"{f.numerator}/{f.denominator}s"
            else:
                return float(numerator) / float(denominator)
        except (TypeError, ValueError, ZeroDivisionError):
            pass
    return value

def convert_exif_value(key: str, value: Any) -> Any:
    """Converts EXIF values to more readable/storable formats."""
    if isinstance(value, bytes):
        try:
            return value.decode('utf-8')
        except UnicodeDecodeError:
            return str(value) # Fallback for undecodable bytes
    elif key == 'FNumber' and (isinstance(value, tuple) or isinstance(value, IFDRational)):
        return _convert_rational(value, as_fraction_string=False)
    elif key == 'ExposureTime' and (isinstance(value, tuple) or isinstance(value, IFDRational)):
        return _convert_rational(value, as_fraction_string=True)
    # For other rational values like ShutterSpeedValue, ApertureValue
    elif (isinstance(value, tuple) and len(value) == 2 and all(isinstance(v, (int, float)) for v in value)) or isinstance(value, IFDRational):
        return _convert_rational(value, as_fraction_string=False)
    return value

def extract_exif(image_path: str) -> Dict[str, Any]:
    """Extracts and cleans EXIF data from an image."""
    try:
        exif_data_raw = {}
        if image_path.lower().endswith(('.heic', '.heif')):
            try:
                heif_file = pillow_heif.open_heif(image_path)
                if heif_file:
                    logger.debug(f"HEIF file opened for {image_path}")
                    # First try heif_file.info["exif"]
                    exif_bytes = heif_file.info.get("exif")
                    if exif_bytes:
                        logger.debug(f"Found EXIF in heif_file.info['exif'] for {image_path}")
                        try:
                            loaded_exif = piexif.load(exif_bytes)
                            if loaded_exif is not None:
                                exif_data_raw = loaded_exif
                            else:
                                logger.warning(f"piexif.load returned None or empty for {image_path}.")
                                exif_data_raw = {}
                        except Exception as exif_e:
                            logger.warning(f"piexif.load failed for {image_path}: {exif_e}")
                            exif_data_raw = {}
                    # If that fails, try heif_file.metadata
                    elif hasattr(heif_file, 'metadata') and heif_file.metadata:
                        logger.debug(f"Checking heif_file.metadata for {image_path}")
                        for metadata in heif_file.metadata:
                            if metadata.get('type') == 'Exif' and metadata.get('data'):
                                logger.debug(f"Found EXIF in metadata for {image_path}")
                                try:
                                    loaded_exif = piexif.load(metadata['data'])
                                    if loaded_exif is not None:
                                        exif_data_raw = loaded_exif
                                    else:
                                        logger.warning(f"piexif.load returned None or empty for {image_path} (metadata).")
                                        exif_data_raw = {}
                                except Exception as exif_e:
                                    logger.warning(f"piexif.load failed for {image_path} (metadata): {exif_e}")
                                    exif_data_raw = {}
                                break
                    if not exif_data_raw:
                        logger.warning(f"No valid EXIF data found in HEIF file {image_path}")
                        return {}
                else:
                    logger.warning(f"Could not open HEIF file {image_path}")
                    return {}
            except Exception as heif_e:
                logger.error(f"Error processing HEIF file {image_path}: {heif_e}")
                return {}
        else:
            img = Image.open(image_path)
            exif_data_raw = img._getexif()
            if exif_data_raw is None:
                logger.warning(f"_getexif() returned None for {image_path}")
                return {}

        if not exif_data_raw:
            return {}

        exif = {}
        # Unified way to get EXIF data into a dictionary with tag names as keys
        if isinstance(exif_data_raw, dict) and '0th' in exif_data_raw: # piexif format
            for ifd_name in ['0th', 'Exif', 'GPS', 'Interop', '1st', 'thumbnail']:
                if ifd_name in exif_data_raw:
                    # Ensure the value for the IFD is a dictionary before calling .items()
                    if isinstance(exif_data_raw[ifd_name], dict):
                        for tag_key, value in exif_data_raw[ifd_name].items():
                            tag_name = ExifTags.TAGS.get(tag_key, tag_key)
                            exif[tag_name] = value
        elif isinstance(exif_data_raw, dict): # Pillow _getexif() format
            exif = {
                ExifTags.TAGS[k]: v
                for k, v in exif_data_raw.items()
                if k in ExifTags.TAGS
            }
        else:
            return {} # Unknown EXIF data format

        processed_exif = {}
        for exif_key, field_name in EXIF_MAPPING.items():
            if exif_key in exif and exif_key not in EXIF_IGNORE_TAGS:
                value = exif[exif_key]
                # Special handling for DateTimeOriginal
                if exif_key == 'DateTimeOriginal':
                    dt_str = value
                    logger.debug(f"Raw DateTimeOriginal: {dt_str}")
                    if isinstance(dt_str, bytes):
                        dt_str = dt_str.decode('utf-8')
                    try:
                        # Try parsing various date formats
                        if 'T' in dt_str and dt_str.endswith('Z'):
                            dt_obj = datetime.strptime(dt_str, '%Y-%m-%dT%H:%M:%S%Z')
                        else: # Fallback to common EXIF format
                            dt_obj = datetime.strptime(dt_str, '%Y:%m:%d %H:%M:%S')
                        processed_value = dt_obj.isoformat(timespec='seconds') + 'Z'
                        processed_exif[field_name] = processed_value
                    except ValueError:
                        logger.warning(f"Could not parse DateTimeOriginal '{dt_str}' from {image_path}. Trying fallback.")
                        # Try fallback to DateTime if available
                        if 'DateTime' in exif:
                            dt_str = exif['DateTime']
                            if isinstance(dt_str, bytes):
                                dt_str = dt_str.decode('utf-8')
                            try:
                                dt_obj = datetime.strptime(dt_str, '%Y:%m:%d %H:%M:%S')
                                processed_value = dt_obj.isoformat(timespec='seconds') + 'Z'
                                processed_exif[field_name] = processed_value
                            except ValueError:
                                logger.warning(f"Could not parse DateTime fallback '{dt_str}' from {image_path}. Using file modification time.")
                                # Use file modification time as last resort
                                file_time = datetime.fromtimestamp(os.path.getmtime(image_path))
                                processed_value = file_time.isoformat(timespec='seconds') + 'Z'
                                processed_exif[field_name] = processed_value
                else:
                    # Ensure value is a simple type for YAML serialization
                    processed_exif[field_name] = convert_exif_value(exif_key, value)

        return processed_exif
    except Exception as e:
        logger.error(f"Error extracting EXIF from {image_path}: {e}")
        return {}

def read_existing_markdown(md_path: str) -> Optional[Dict[str, Any]]:
    """Reads existing markdown file to preserve manual edits."""
    try:
        with open(md_path, 'r', encoding='utf-8') as f:
            content = f.read()
            if '---' in content:
                _, frontmatter, _ = content.split('---', 2)
                return yaml.safe_load(frontmatter)
    except Exception as e:
        logger.warning(f"Could not read existing markdown {md_path}: {e}")
    return None

def generate_markdown_file(image_filename: str, exif_data: Dict[str, Any], force_update: bool = False) -> None:
    """Generates a Markdown file with YAML frontmatter."""
    md_filename = os.path.splitext(image_filename)[0] + '.md'
    output_path = os.path.join(OUTPUT_DIR, md_filename)
    
    # Get optimized image path
    optimized_filename = os.path.splitext(image_filename)[0] + '.jpg'
    optimized_path = os.path.join(OPTIMIZED_DIR, optimized_filename)
    image_path_for_md = f"/photographs/optimized/{optimized_filename}"

    # Read existing markdown if it exists
    existing_data = read_existing_markdown(output_path) if not force_update else None

    # Extract EXIF data from the optimized image if it exists, otherwise from original
    if os.path.exists(optimized_path):
        exif_data = extract_exif(optimized_path)
        logger.debug(f"EXIF data from optimized image: {exif_data}")
    else:
        original_image_path = os.path.join(PHOTOGRAPHS_DIR, image_filename)
        exif_data = extract_exif(original_image_path)
        logger.debug(f"EXIF data from original image: {exif_data}")

    # Prepare frontmatter
    frontmatter = {
        'title': existing_data.get('title') if existing_data else None,
        'description': existing_data.get('description') if existing_data else None,
        'year': int(exif_data['dateTaken'][:4]) if 'dateTaken' in exif_data and exif_data['dateTaken'] else None,
        'dateTaken': exif_data.get('dateTaken'),
        'image': image_path_for_md,
        'defaultBackgroundColor': 'black',
    }
    
    # Add extracted EXIF data, preserving manual edits
    for key, value in exif_data.items():
        if key not in ['title', 'description', 'image', 'defaultBackgroundColor', 'dateTaken']:
            frontmatter[key] = value

    # Sort keys for cleaner YAML
    frontmatter_sorted = {k: frontmatter[k] for k in sorted(frontmatter.keys(), 
        key=lambda x: (x != 'title', x != 'description', x != 'year', x != 'dateTaken', x != 'image', 
                      x != 'make', x != 'model', x != 'focalLength', x != 'aperture', 
                      x != 'shutterSpeed', x != 'iso', x != 'lens', x != 'defaultBackgroundColor', x))}

    # Remove None values
    final_frontmatter = {k: v for k, v in frontmatter_sorted.items() if v is not None}

    # Generate markdown content
    yaml_content = yaml.dump(final_frontmatter, sort_keys=False, default_flow_style=False, allow_unicode=True)
    markdown_content = f"---\n{yaml_content}---\n"

    # Write markdown file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    logger.info(f"Generated: {output_path}")

    # Optimize image if needed
    if not os.path.exists(optimized_path):
        input_path = os.path.join(PHOTOGRAPHS_DIR, image_filename)
        if optimize_image(input_path, optimized_path):
            logger.info(f"Optimized: {optimized_path}")
        else:
            logger.error(f"Failed to optimize: {optimized_path}")

def verify_exif_preservation(original_path: str, converted_path: str) -> bool:
    """Verifies that EXIF data was properly preserved during conversion."""
    try:
        original_exif = extract_exif(original_path)
        converted_exif = extract_exif(converted_path)
        
        # Compare critical EXIF fields
        critical_fields = ['dateTaken', 'make', 'model', 'focalLength', 'aperture', 'shutterSpeed', 'iso', 'lens']
        
        all_preserved = True
        for field in critical_fields:
            original_value = original_exif.get(field)
            converted_value = converted_exif.get(field)

            if original_value is None and converted_value is None:
                continue
            
            if original_value is None and converted_value is not None:
                logger.warning(f"EXIF field '{field}' present in converted but not original ({converted_path})")
                all_preserved = False
                continue

            if original_value is not None and converted_value is None:
                logger.warning(f"EXIF field '{field}' was not preserved for {converted_path}")
                all_preserved = False
                continue

            # Convert values to comparable types
            if field == 'shutterSpeed' and original_value is not None and converted_value is not None:
                try:
                    # Attempt to convert to float for comparison if it's a string like '1/X s'
                    original_comp_value = float(eval(original_value.replace('s', ''))) if isinstance(original_value, str) and '/' in original_value else float(original_value)
                    converted_comp_value = float(eval(converted_value.replace('s', ''))) if isinstance(converted_value, str) and '/' in converted_value else float(converted_value)
                except (ValueError, TypeError, SyntaxError):
                    original_comp_value = original_value
                    converted_comp_value = converted_value
            else:
                original_comp_value = convert_exif_value(field, original_value)
                converted_comp_value = convert_exif_value(field, converted_value)

            # Compare numerical values with tolerance
            if isinstance(original_comp_value, (int, float)) and isinstance(converted_comp_value, (int, float)):
                if not math.isclose(original_comp_value, converted_comp_value, rel_tol=1e-3, abs_tol=1e-6):
                    logger.warning(f"EXIF field '{field}' value changed during conversion for {converted_path}: Original '{original_comp_value}', Converted '{converted_comp_value}'")
                    all_preserved = False
            elif original_comp_value != converted_comp_value:
                logger.warning(f"EXIF field '{field}' value changed during conversion for {converted_path}: Original '{original_comp_value}', Converted '{converted_comp_value}'")
                all_preserved = False
        
        return all_preserved
    except Exception as e:
        logger.error(f"Error verifying EXIF preservation for {converted_path}: {e}")
        return False

def cleanup_temp_files(directory: str, pattern: str = "*.temp.jpg") -> None:
    """Cleans up temporary files in the specified directory."""
    try:
        temp_files = list(Path(directory).glob(pattern))
        for temp_file in temp_files:
            try:
                temp_file.unlink()
                logger.debug(f"Cleaned up temporary file: {temp_file}")
            except Exception as e:
                logger.warning(f"Failed to remove temporary file {temp_file}: {e}")
    except Exception as e:
        logger.error(f"Error during cleanup: {e}")

def process_image(filename: str, force_update: bool = False) -> Tuple[bool, str]:
    """Process a single image file."""
    try:
        image_path = os.path.join(PHOTOGRAPHS_DIR, filename)
        logger.info(f"Processing: {filename}")
        
        # Extract EXIF data
        exif_data = extract_exif(image_path)
        
        # Generate markdown file
        generate_markdown_file(filename, exif_data, force_update)
        
        # Get optimized image path
        optimized_filename = os.path.splitext(filename)[0] + '.jpg'
        optimized_path = os.path.join(OPTIMIZED_DIR, optimized_filename)
        
        # Verify EXIF preservation if it's a HEIC file
        if filename.lower().endswith(('.heic', '.heif')):
            if not verify_exif_preservation(image_path, optimized_path):
                logger.warning(f"EXIF verification failed for {filename}")
                return False, f"EXIF verification failed for {filename}"
        
        return True, f"Successfully processed {filename}"
    except Exception as e:
        error_msg = f"Error processing {filename}: {e}"
        logger.error(error_msg)
        return False, error_msg

def main():
    """Main function to process all images."""
    logger.info(f"Scanning for photographs in: {PHOTOGRAPHS_DIR}")
    
    # Get list of image files
    image_files = [
        f for f in os.listdir(PHOTOGRAPHS_DIR)
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp', '.heic', '.heif'))
    ]
    
    if not image_files:
        logger.warning("No image files found in the photographs directory")
        return
    
    # Process images with progress bar
    success_count = 0
    error_count = 0
    errors = []
    
    with tqdm(total=len(image_files), desc="Processing images", unit="image") as pbar:
        for filename in image_files:
            success, message = process_image(filename)
            if success:
                success_count += 1
            else:
                error_count += 1
                errors.append(message)
            pbar.update(1)
            pbar.set_postfix({"success": success_count, "errors": error_count})
    
    # Cleanup temporary files
    cleanup_temp_files(OPTIMIZED_DIR)
    
    # Print summary
    logger.info(f"\nProcessing complete!")
    logger.info(f"Successfully processed: {success_count} images")
    if error_count > 0:
        logger.warning(f"Failed to process: {error_count} images")
        logger.warning("Errors encountered:")
        for error in errors:
            logger.warning(f"- {error}")
    
    if error_count > 0:
        sys.exit(1)

if __name__ == "__main__":
    main() 