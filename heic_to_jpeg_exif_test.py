import pillow_heif
from PIL import Image
import piexif
import sys

heic_path = 'public/photographs/IMG_0526.HEIC'
jpeg_path = 'public/photographs/optimized/IMG_0526_test.jpg'

def print_exif_from_bytes(exif_bytes, label):
    try:
        exif_dict = piexif.load(exif_bytes)
        print(f'--- {label} EXIF ---')
        for ifd in exif_dict:
            if isinstance(exif_dict[ifd], dict):
                for tag, value in exif_dict[ifd].items():
                    print(f'{ifd} {tag}: {value}')
    except Exception as e:
        print(f'Could not parse EXIF for {label}: {e}')

def main():
    heif_file = pillow_heif.open_heif(heic_path)
    print('HeifFile attributes:', dir(heif_file))
    exif_bytes = None
    if 'exif' in heif_file.info:
        exif_bytes = heif_file.info['exif']
        print('Found EXIF in heif_file.info')
    elif hasattr(heif_file, 'metadata'):
        for metadata in heif_file.metadata:
            if metadata.get('type') == 'Exif' and metadata.get('data'):
                exif_bytes = metadata['data']
                print('Found EXIF in heif_file.metadata')
                break
    if exif_bytes:
        print_exif_from_bytes(exif_bytes, 'HEIC')
    else:
        print('No EXIF found in HEIC')

    # Use only the attributes that exist
    # Most recent pillow_heif exposes .mode, .size, .data, .stride
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
        print(f'Failed to create PIL image from HEIF: {e}')
        return

    if image.mode in ('RGBA', 'P'):
        image = image.convert('RGB')

    if exif_bytes:
        try:
            image.save(jpeg_path, 'JPEG', quality=95, exif=exif_bytes)
            print('Saved JPEG with EXIF')
        except Exception as e:
            print(f'Failed to save JPEG with EXIF: {e}')
            try:
                exif_dict = piexif.load(exif_bytes)
                exif_bytes2 = piexif.dump(exif_dict)
                image.save(jpeg_path, 'JPEG', quality=95, exif=exif_bytes2)
                print('Saved JPEG with piexif-processed EXIF')
            except Exception as e2:
                print(f'Failed to save JPEG with piexif: {e2}')
    else:
        image.save(jpeg_path, 'JPEG', quality=95)
        print('Saved JPEG without EXIF')

    # Now read back the EXIF from the JPEG
    try:
        img2 = Image.open(jpeg_path)
        exif_bytes_jpeg = img2.info.get('exif')
        if exif_bytes_jpeg:
            print_exif_from_bytes(exif_bytes_jpeg, 'JPEG')
        else:
            print('No EXIF found in JPEG')
    except Exception as e:
        print(f'Error reading EXIF from JPEG: {e}')

if __name__ == '__main__':
    main() 