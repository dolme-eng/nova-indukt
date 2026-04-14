# Image Upload Component Usage

## Multiple Images Upload

```tsx
import { ImageUpload } from '@/components/image-upload'

function ProductForm() {
  const handleUpload = (images) => {
    console.log('Uploaded images:', images)
    // images = [{ id: '...', url: '...', width: 800, height: 600 }]
  }

  return (
    <ImageUpload
      onUpload={handleUpload}
      maxFiles={5}
      folder="nova-indukt/products"
    />
  )
}
```

## Single Image Upload (Avatar, Profile Photo)

```tsx
import { SingleImageUpload } from '@/components/image-upload'

function ProfileForm() {
  const handleUpload = (image) => {
    console.log('Uploaded image:', image)
    // image = { id: '...', url: '...', width: 400, height: 400 }
    // or null if removed
  }

  return (
    <SingleImageUpload
      onUpload={handleUpload}
      folder="nova-indukt/avatars"
      aspectRatio="1 / 1"
    />
  )
}
```

## Using Cloudinary Optimized URLs

```tsx
import { useCloudinaryUrl } from '@/lib/hooks/use-cloudinary-image'

function ProductCard({ product }) {
  // Get optimized URL with auto format and quality
  const imageUrl = useCloudinaryUrl(product.imageId, {
    width: 400,
    height: 300,
    crop: 'fill',
  })

  return <img src={imageUrl} alt={product.name} />
}
```

## Configuration

Add to `.env.local`:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

## Features

- Drag & drop upload
- Multiple file selection
- Image validation (type, size)
- Progress indication
- Preview with remove option
- Automatic Cloudinary optimization
- Responsive image support
