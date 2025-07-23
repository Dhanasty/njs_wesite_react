import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsService, uploadService } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const ProductForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const isEditing = Boolean(id)
  const [uploadingImages, setUploadingImages] = useState(new Set())

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Chettinad Silks',
    stockQuantity: '',
    features: [''],
    images: [],
    colors: [{ name: '', value: '#000000', images: [''] }],
    specifications: {
      fabric: '',
      length: '',
      width: '',
      weight: '',
      washCare: ['']
    }
  })

  // Fetch product data for editing
  const { isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getById(id).then(res => res.data.product),
    enabled: isEditing,
    onSuccess: (data) => {
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        originalPrice: data.originalPrice?.toString() || '',
        category: data.category || 'Chettinad Silks',
        stockQuantity: data.stockQuantity?.toString() || '',
        features: data.features?.length ? data.features : [''],
        images: data.images || [],
        colors: data.colors?.length ? 
          data.colors.map(color => ({
            ...color,
            images: Array.isArray(color.images) ? color.images : (color.image ? [color.image] : [''])
          })) : 
          [{ name: '', value: '#000000', images: [''] }],
        specifications: {
          fabric: data.specifications?.fabric || '',
          length: data.specifications?.length || '',
          width: data.specifications?.width || '',
          weight: data.specifications?.weight || '',
          washCare: data.specifications?.washCare?.length ? data.specifications.washCare : ['']
        }
      })
    }
  })

  // Create/Update mutations
  const createMutation = useMutation({
    mutationFn: productsService.create,
    onSuccess: () => {
      toast.success('Product created successfully!')
      queryClient.invalidateQueries(['products'])
      navigate('/products')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create product')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => productsService.update(id, data),
    onSuccess: () => {
      toast.success('Product updated successfully!')
      queryClient.invalidateQueries(['products'])
      queryClient.invalidateQueries(['product', id])
      navigate('/products')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product')
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice),
      stockQuantity: parseInt(formData.stockQuantity),
      features: formData.features.filter(f => f.trim()),
      colors: formData.colors.filter(c => c.name.trim()).map(color => ({
        ...color,
        images: color.images.filter(img => img.trim())
      })),
      specifications: {
        ...formData.specifications,
        washCare: formData.specifications.washCare.filter(w => w.trim())
      }
    }

    if (isEditing) {
      updateMutation.mutate({ id, data: submitData })
    } else {
      createMutation.mutate(submitData)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSpecificationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }))
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleFeatureChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }))
  }

  // Color management functions
  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: '', value: '#000000', images: [''] }]
    }))
  }

  const removeColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }))
  }

  const handleColorChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }))
  }

  // Color image management functions
  const addColorImage = (colorIndex) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === colorIndex ? { ...color, images: [...color.images, ''] } : color
      )
    }))
  }

  const removeColorImage = (colorIndex, imageIndex) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === colorIndex ? { 
          ...color, 
          images: color.images.filter((_, imgI) => imgI !== imageIndex)
        } : color
      )
    }))
  }

  const handleColorImageChange = (colorIndex, imageIndex, value) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === colorIndex ? {
          ...color,
          images: color.images.map((img, imgI) => imgI === imageIndex ? value : img)
        } : color
      )
    }))
  }

  // Image upload functions
  const uploadImage = async (file, colorIndex, imageIndex) => {
    const uploadKey = `${colorIndex}-${imageIndex}`
    setUploadingImages(prev => new Set(prev).add(uploadKey))

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await uploadService.uploadSingle(formData)
      const imageUrl = response.data.data.url

      // Update the specific color image
      handleColorImageChange(colorIndex, imageIndex, imageUrl)
      toast.success('Image uploaded successfully!')
    } catch (error) {
      toast.error('Failed to upload image')
      console.error('Upload error:', error)
    } finally {
      setUploadingImages(prev => {
        const newSet = new Set(prev)
        newSet.delete(uploadKey)
        return newSet
      })
    }
  }

  const handleFileSelect = (event, colorIndex, imageIndex) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      uploadImage(file, colorIndex, imageIndex)
    }
  }

  // Wash care management functions
  const addWashCare = () => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        washCare: [...prev.specifications.washCare, '']
      }
    }))
  }

  const removeWashCare = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        washCare: prev.specifications.washCare.filter((_, i) => i !== index)
      }
    }))
  }

  const handleWashCareChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        washCare: prev.specifications.washCare.map((care, i) => 
          i === index ? value : care
        )
      }
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text={`Loading ${isEditing ? 'product' : 'form'}...`} />
      </div>
    )
  }

  const isSubmitting = createMutation.isLoading || updateMutation.isLoading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/products')}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-neutral-600">
              {isEditing ? 'Update product information' : 'Create a new silk saree product'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Basic Information</h3>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="Chettinad Silks">Chettinad Silks</option>
                  <option value="Soft Sico">Soft Sico</option>
                  <option value="Ikath">Ikath</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="form-textarea"
                placeholder="Describe the product..."
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Current Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="form-label">Original Price (₹)</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="form-label">Stock Quantity *</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Product Features</h3>
          </div>
          <div className="card-body space-y-3">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="form-input flex-1"
                  placeholder="Enter product feature"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="btn-outline px-3"
                  disabled={formData.features.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="btn-secondary"
            >
              Add Feature
            </button>
          </div>
        </div>

        {/* Colors */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Available Colors</h3>
          </div>
          <div className="card-body space-y-4">
            {formData.colors.map((color, index) => (
              <div key={index} className="p-4 border border-neutral-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-neutral-700">Color {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                    disabled={formData.colors.length === 1}
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Color Name *</label>
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                      className="form-input"
                      placeholder="e.g., Royal Blue"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Color Value</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={color.value}
                        onChange={(e) => handleColorChange(index, 'value', e.target.value)}
                        className="w-12 h-10 border border-neutral-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color.value}
                        onChange={(e) => handleColorChange(index, 'value', e.target.value)}
                        className="form-input flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="form-label">Color Images</label>
                    <div className="space-y-3">
                      {color.images.map((image, imageIndex) => {
                        const uploadKey = `${index}-${imageIndex}`
                        const isUploading = uploadingImages.has(uploadKey)
                        
                        return (
                          <div key={imageIndex} className="p-3 border border-neutral-200 rounded-lg space-y-2">
                            {/* Image Preview */}
                            {image && (
                              <div className="relative w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden">
                                <img
                                  src={image}
                                  alt={`${color.name} preview ${imageIndex + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                  }}
                                />
                              </div>
                            )}
                            
                            {/* Upload and URL Input */}
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <input
                                  type="url"
                                  value={image}
                                  onChange={(e) => handleColorImageChange(index, imageIndex, e.target.value)}
                                  className="form-input w-full"
                                  placeholder="https://example.com/image.jpg or upload file"
                                />
                              </div>
                              
                              {/* File Upload Button */}
                              <div className="flex gap-1">
                                <label className="btn-secondary px-3 cursor-pointer relative">
                                  {isUploading ? (
                                    <LoadingSpinner size="sm" />
                                  ) : (
                                    <Upload className="h-4 w-4" />
                                  )}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileSelect(e, index, imageIndex)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    disabled={isUploading}
                                  />
                                </label>
                                
                                {/* Remove Button */}
                                <button
                                  type="button"
                                  onClick={() => removeColorImage(index, imageIndex)}
                                  className="btn-outline px-3"
                                  disabled={color.images.length === 1}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            
                            {/* Upload Instructions */}
                            <p className="text-xs text-neutral-500">
                              Upload image (max 5MB) or enter image URL
                            </p>
                          </div>
                        )
                      })}
                      
                      <button
                        type="button"
                        onClick={() => addColorImage(index)}
                        className="btn-secondary text-sm px-4 py-2"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Add Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addColor}
              className="btn-secondary"
            >
              Add Color
            </button>
          </div>
        </div>

        {/* Specifications */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Specifications</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Fabric</label>
                <input
                  type="text"
                  value={formData.specifications.fabric}
                  onChange={(e) => handleSpecificationChange('fabric', e.target.value)}
                  className="form-input"
                  placeholder="e.g., Pure Silk"
                />
              </div>
              <div>
                <label className="form-label">Length</label>
                <input
                  type="text"
                  value={formData.specifications.length}
                  onChange={(e) => handleSpecificationChange('length', e.target.value)}
                  className="form-input"
                  placeholder="e.g., 5.5 meters"
                />
              </div>
              <div>
                <label className="form-label">Width</label>
                <input
                  type="text"
                  value={formData.specifications.width}
                  onChange={(e) => handleSpecificationChange('width', e.target.value)}
                  className="form-input"
                  placeholder="e.g., 44 inches"
                />
              </div>
              <div>
                <label className="form-label">Weight</label>
                <input
                  type="text"
                  value={formData.specifications.weight}
                  onChange={(e) => handleSpecificationChange('weight', e.target.value)}
                  className="form-input"
                  placeholder="e.g., 700 grams"
                />
              </div>
            </div>
            
            {/* Wash Care Instructions */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-neutral-700 mb-3">Wash Care Instructions</h4>
              <div className="space-y-3">
                {formData.specifications.washCare.map((care, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={care}
                      onChange={(e) => handleWashCareChange(index, e.target.value)}
                      className="form-input flex-1"
                      placeholder="Enter wash care instruction"
                    />
                    <button
                      type="button"
                      onClick={() => removeWashCare(index)}
                      className="btn-outline px-3"
                      disabled={formData.specifications.washCare.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addWashCare}
                  className="btn-secondary"
                >
                  Add Wash Care Instruction
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn-outline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                {isEditing ? 'Update Product' : 'Create Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm