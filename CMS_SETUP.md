# VALIPOKKANN CMS Setup Guide

This guide will help you set up a free, GitHub-based CMS for your website that works with GitHub Pages.

## 🎯 What We Built

A completely free CMS that:
- ✅ Works with GitHub Pages (no hosting costs)
- ✅ Uses GitHub OAuth for authentication
- ✅ Stores all content as markdown files (version controlled)
- ✅ Handles images, articles, artwork, and photography
- ✅ No database required
- ✅ No monthly fees

## 🚀 Quick Setup

### 1. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: `VALIPOKKANN CMS`
   - **Homepage URL**: `https://valipokkann.in`
   - **Authorization callback URL**: `https://valipokkann.in/admin/auth-callback.html`

### 2. Get Your Client ID

After creating the OAuth app, you'll get a Client ID. Copy it.

### 3. Update Authentication

Edit `public/admin/auth.html` and replace `YOUR_GITHUB_CLIENT_ID` with your actual Client ID.

### 4. Access Your CMS

- **CMS Interface**: https://valipokkann.in/admin/
- **Authentication**: https://valipokkann.in/admin/auth.html

## 📁 CMS Structure

The CMS manages these content types:

### Articles (`src/data/articles/`)
- Title, date, tags, and markdown body
- Perfect for blog posts and long-form content

### Artwork (`src/data/artwork/`)
- Complete NFT metadata (blockchain, contract, token ID)
- Process images, press mentions, pricing
- Artist notes and exhibition history

### Photography (`src/data/photography/`)
- Camera metadata (make, model, settings)
- NFT information for digital photography
- Tags and descriptions

## 🔧 How It Works

1. **Authentication**: Users sign in with GitHub OAuth
2. **Content Creation**: CMS creates markdown files in `src/data/`
3. **Image Upload**: Images go to `public/` directories
4. **Version Control**: All changes are committed to GitHub
5. **Deployment**: GitHub Pages automatically rebuilds the site

## 💡 Benefits

- **Free Forever**: No hosting or CMS fees
- **Version Controlled**: All content changes are tracked in Git
- **Backup**: Your content is safely stored in GitHub
- **Collaboration**: Multiple people can edit with proper permissions
- **Customizable**: Easy to modify fields and structure

## 🛠️ Customization

### Adding New Content Types

Edit `public/admin/config.yml` to add new collections:

```yaml
- name: "your-content-type"
  label: "Your Content Type"
  folder: "src/data/your-content-type"
  create: true
  fields:
    - {label: "Title", name: "title", widget: "string"}
    - {label: "Body", name: "body", widget: "markdown"}
```

### Modifying Fields

Each content type has customizable fields:
- `string`: Simple text input
- `text`: Multi-line text area
- `markdown`: Rich text editor
- `number`: Numeric input
- `datetime`: Date/time picker
- `image`: File upload
- `list`: Array of values

## 🔒 Security

- Only GitHub users with repository access can edit
- All changes are logged in Git history
- No sensitive data stored in the CMS
- OAuth tokens are temporary

## 🚨 Troubleshooting

### CMS Not Loading
- Check that GitHub OAuth is properly configured
- Verify the Client ID is correct
- Ensure the callback URL matches exactly

### Images Not Uploading
- Check that the media folders exist in `public/`
- Verify file permissions on the repository

### Authentication Issues
- Clear browser cache and cookies
- Check that the OAuth app is properly configured
- Verify the callback URL in GitHub settings

## 📞 Support

If you need help:
1. Check the GitHub repository issues
2. Review the Decap CMS documentation
3. Verify your OAuth configuration

---

**Built with ❤️ for VALIPOKKANN**
*No monthly fees, no vendor lock-in, just pure content management.* 