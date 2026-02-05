<template>
  <div class="admin-categories">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-left">
        <div class="header-badge">
          <span class="badge-icon">📦</span>
          <span class="badge-text">Management</span>
        </div>
        <h1 class="header-title">Product Categories</h1>
        <p class="header-subtitle">Organize and structure your store inventory items.</p>
      </div>
      <button @click="openAddModal()" class="create-btn">
        <span class="plus-icon">+</span>
        <span>Create New</span>
      </button>
    </div>

    <!-- Search Bar -->
    <div class="search-container">
      <span class="search-icon">🔍</span>
      <input 
        v-model="searchTerm" 
        type="text" 
        placeholder="Search categories by name or slug..."
        class="search-input"
      />
    </div>

    <!-- Categories List -->
    <div class="categories-list">
      <div 
        v-for="category in filteredCategories" 
        :key="category.id" 
        :class="['category-card', { 'inactive': !category.is_active }]"
      >
        <!-- Parent Category Row -->
        <div class="category-row">
          <button @click="toggleExpand(category.id)" class="expand-btn">
            <span v-if="expandedCategories.includes(category.id)">▼</span>
            <span v-else>▶</span>
          </button>

          <div class="category-image-wrapper">
            <img :src="category.image_url || defaultImage" :alt="category.name" class="category-image" />
            <div :class="['status-dot', category.is_active ? 'active' : 'inactive']"></div>
          </div>

          <div class="category-info">
            <div class="category-name-row">
              <h3 class="category-name">{{ category.name }}</h3>
              <span v-if="!category.is_active" class="hidden-badge">Hidden</span>
            </div>
            <div class="category-meta">
              <span class="slug-info">
                <span class="globe-icon">🌐</span>
                <span class="slug-text">/{{ category.slug }}</span>
              </span>
              <span class="divider">|</span>
              <span class="subcategory-count">{{ category.subcategories?.length || 0 }} Subcategories</span>
            </div>
          </div>

          <div class="category-actions">
            <button 
              @click="toggleStatus(category.id)" 
              :class="['action-btn', 'power-btn', category.is_active ? 'active' : '']"
              title="Toggle Visibility"
            >
              ⚡
            </button>
            <button @click="openEditModal(category)" class="action-btn edit-btn" title="Edit">
              ✏️
            </button>
            <button @click="openDeleteConfirm(category, 'category')" class="action-btn delete-btn" title="Delete">
              🗑️
            </button>
          </div>
        </div>

        <!-- Subcategories Panel -->
        <div v-if="expandedCategories.includes(category.id)" class="subcategories-panel">
          <div class="panel-divider"></div>
          <div class="subcategories-grid">
            <div 
              v-for="sub in category.subcategories" 
              :key="sub.id"
              :class="['subcategory-card', { 'inactive': !sub.is_active }]"
            >
              <img :src="sub.image_url || defaultImage" :alt="sub.name" class="sub-image" />
              <div class="sub-info">
                <p class="sub-name">{{ sub.name }}</p>
                <p class="sub-id">ID: {{ sub.id }}</p>
              </div>
              <div class="sub-actions">
                <button 
                  @click="toggleStatus(sub.id, category.id)" 
                  :class="['sub-action-btn', sub.is_active ? 'active' : '']"
                  title="Toggle"
                >
                  ⚡
                </button>
                <button @click="openEditModal(sub, true)" class="sub-action-btn edit" title="Edit">
                  ✏️
                </button>
                <button @click="openDeleteConfirm(sub, 'subcategory')" class="sub-action-btn delete" title="Delete">
                  🗑️
                </button>
              </div>
            </div>

            <!-- Add Subcategory Button -->
            <button @click="openAddSubcategoryModal(category)" class="add-subcategory-btn">
              <span>+</span> New Sub-Category
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredCategories.length === 0" class="empty-state">
        <p>No categories found. Create your first category!</p>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <div>
            <h2 class="modal-title">{{ isEditing ? `Edit ${formData.name || 'Category'}` : (isAddingSubcategory ? 'New Subcategory' : 'New Category') }}</h2>
            <p class="modal-subtitle">{{ isEditing ? 'Update the details for this item.' : 'Configure your new collection properties.' }}</p>
          </div>
          <button @click="closeModal" class="modal-close-btn">✕</button>
        </div>

        <div class="modal-body">
          <!-- Image Upload -->
          <div class="image-upload-section">
            <label class="image-upload-label">
              <div class="image-preview-container">
                <img v-if="formData.image_url" :src="formData.image_url" class="image-preview" />
                <div v-else class="image-placeholder">
                  <span class="upload-icon">☁️</span>
                  <p class="upload-text">Upload Photo</p>
                </div>
                <div class="image-overlay">
                  <span>+</span>
                </div>
              </div>
              <input type="file" accept="image/*" @change="handleImageUpload" class="hidden-input" />
            </label>
          </div>

          <!-- Form Fields -->
          <div class="form-fields">
            <div class="form-group">
              <label class="form-label">Title</label>
              <input 
                v-model="formData.name" 
                type="text" 
                placeholder="Category Name"
                class="form-input"
                @input="generateSlug"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Slug</label>
              <div class="slug-input-wrapper">
                <span class="slug-prefix">🌐</span>
                <input 
                  v-model="formData.slug" 
                  type="text" 
                  placeholder="category-slug"
                  class="form-input slug-input"
                />
              </div>
            </div>
          </div>

          <!-- Active Toggle -->
          <div class="toggle-section">
            <div class="toggle-info">
              <div :class="['toggle-icon-wrapper', formData.is_active ? 'active' : '']">
                ⚡
              </div>
              <div>
                <p class="toggle-title">Visible on Storefront</p>
                <p class="toggle-subtitle">Toggle item availability for customers</p>
              </div>
            </div>
            <button @click="formData.is_active = formData.is_active ? 0 : 1" :class="['toggle-switch', formData.is_active ? 'active' : '']">
              <div class="toggle-knob"></div>
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="cancel-btn">Cancel</button>
          <button @click="saveCategory" :disabled="loading" class="save-btn">
            {{ loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Category') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="deleteConfirm" class="modal-overlay" @click.self="deleteConfirm = null">
      <div class="delete-dialog">
        <div class="delete-icon-wrapper">
          ⚠️
        </div>
        <h2 class="delete-title">Are you sure?</h2>
        <p class="delete-message">
          Deleting <span class="delete-item-name">{{ deleteConfirm.name }}</span> will permanently remove this record from the database. This action cannot be undone.
        </p>
        <div class="delete-actions">
          <button @click="confirmDelete" class="confirm-delete-btn">Confirm Delete</button>
          <button @click="deleteConfirm = null" class="keep-btn">Keep It</button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toastMessage" class="toast">
      <span class="toast-icon">✓</span>
      <span class="toast-text">{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { uploadToCloudinary } from '@/utils/cloudinary';
import api from '../axios/Axios';

export default {
  name: 'AdminCategories',
  setup() {
    // State
    const categories = ref([]);
    const loading = ref(false);
    const searchTerm = ref('');
    const expandedCategories = ref([]);
    const showModal = ref(false);
    const isEditing = ref(false);
    const isAddingSubcategory = ref(false);
    const editingId = ref(null);
    const parentCategoryId = ref(null);
    const deleteConfirm = ref(null);
    const toastMessage = ref('');
    const imageFile = ref(null);
    
    const defaultImage = 'https://placehold.co/200x200?text=No+Image';

    const formData = ref({
      name: '',
      slug: '',
      image_url: '',
      is_active: 1,
      parent_id: null
    });

    // Computed
    const filteredCategories = computed(() => {
      if (!searchTerm.value) return categories.value;
      const term = searchTerm.value.toLowerCase();
      return categories.value.filter(cat => 
        cat.name.toLowerCase().includes(term) || 
        (cat.slug && cat.slug.toLowerCase().includes(term))
      );
    });

    // Methods
    const showToast = (message) => {
      toastMessage.value = message;
      setTimeout(() => toastMessage.value = '', 3000);
    };

    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories/admin/all');
        categories.value = data;
      } catch (err) {
        // Fallback to public endpoint if admin endpoint fails
        try {
          const { data } = await api.get('/categories');
          categories.value = data;
        } catch (e) {
          showToast('Failed to fetch categories');
        }
      }
    };

    const generateSlug = () => {
      if (formData.value.name) {
        formData.value.slug = formData.value.name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      }
    };

    const toggleExpand = (categoryId) => {
      const index = expandedCategories.value.indexOf(categoryId);
      if (index === -1) {
        expandedCategories.value.push(categoryId);
      } else {
        expandedCategories.value.splice(index, 1);
      }
    };

    const openAddModal = () => {
      isEditing.value = false;
      isAddingSubcategory.value = false;
      editingId.value = null;
      parentCategoryId.value = null;
      formData.value = {
        name: '',
        slug: '',
        image_url: '',
        is_active: 1,
        parent_id: null
      };
      imageFile.value = null;
      showModal.value = true;
    };

    const openAddSubcategoryModal = (parentCategory) => {
      isEditing.value = false;
      isAddingSubcategory.value = true;
      editingId.value = null;
      parentCategoryId.value = parentCategory.id;
      formData.value = {
        name: '',
        slug: '',
        image_url: null,
        is_active: 1,
        parent_id: parentCategory.id
      };
      imageFile.value = null;
      showModal.value = true;
    };

    const openEditModal = (item, isSubcategory = false) => {
      isEditing.value = true;
      isAddingSubcategory.value = isSubcategory;
      editingId.value = item.id;
      parentCategoryId.value = item.parent_id;
      formData.value = {
        name: item.name,
        slug: item.slug || '',
        image_url: item.image_url || '',
        is_active: item.is_active,
        parent_id: item.parent_id
      };
      imageFile.value = null;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      isEditing.value = false;
      isAddingSubcategory.value = false;
      editingId.value = null;
      parentCategoryId.value = null;
      formData.value = {
        name: '',
        slug: '',
        image_url: '',
        is_active: 1,
        parent_id: null
      };
      imageFile.value = null;
    };

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (file) {
        imageFile.value = file;
        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
          formData.value.image_url = reader.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const saveCategory = async () => {
      if (!formData.value.name.trim()) {
        showToast('Please enter a category name');
        return;
      }

      try {
        loading.value = true;
        let imageUrl = formData.value.image_url;

        // Upload image if new file selected
        if (imageFile.value) {
          imageUrl = await uploadToCloudinary(imageFile.value);
        }

        const payload = {
          name: formData.value.name,
          image_url: imageUrl,
          is_active: formData.value.is_active,
          parent_id: formData.value.parent_id
        };

        if (isEditing.value) {
          await api.put(`/categories/${editingId.value}`, payload);
          showToast('Category updated successfully');
        } else {
          await api.post('/categories', payload);
          showToast('Category created successfully');
        }

        closeModal();
        fetchCategories();
      } catch (err) {
        console.error('Error saving category:', err);
        showToast('Failed to save category');
      } finally {
        loading.value = false;
      }
    };

    const toggleStatus = async (id, parentId = null) => {
      try {
        await api.patch(`/categories/${id}/toggle-status`);
        showToast('Status updated');
        fetchCategories();
      } catch (err) {
        showToast('Failed to update status');
      }
    };

    const openDeleteConfirm = (item, type) => {
      deleteConfirm.value = {
        id: item.id,
        name: item.name,
        type: type
      };
    };

    const confirmDelete = async () => {
      if (!deleteConfirm.value) return;

      try {
        await api.delete(`/categories/${deleteConfirm.value.id}`);
        showToast('Category deleted successfully');
        deleteConfirm.value = null;
        fetchCategories();
      } catch (err) {
        showToast('Failed to delete category');
      }
    };

    onMounted(() => {
      fetchCategories();
    });

    return {
      categories,
      loading,
      searchTerm,
      expandedCategories,
      showModal,
      isEditing,
      isAddingSubcategory,
      formData,
      deleteConfirm,
      toastMessage,
      defaultImage,
      filteredCategories,
      fetchCategories,
      generateSlug,
      toggleExpand,
      openAddModal,
      openAddSubcategoryModal,
      openEditModal,
      closeModal,
      handleImageUpload,
      saveCategory,
      toggleStatus,
      openDeleteConfirm,
      confirmDelete
    };
  }
};
</script>

<style scoped>
.admin-categories {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #F8FAFC;
  min-height: 100vh;
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;
  flex-wrap: wrap;
  gap: 24px;
}

.header-left {
  flex: 1;
}

.header-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.badge-icon {
  padding: 8px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border-radius: 10px;
  font-size: 18px;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
}

.badge-text {
  font-size: 12px;
  font-weight: 700;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.header-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px 0;
  letter-spacing: -1px;
}

.header-subtitle {
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #0f172a;
  color: white;
  padding: 16px 32px;
  border-radius: 16px;
  border: none;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.2);
}

.create-btn:hover {
  background: #6366f1;
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(99, 102, 241, 0.3);
}

.plus-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.create-btn:hover .plus-icon {
  transform: rotate(90deg);
}

/* Search Bar */
.search-container {
  position: relative;
  margin-bottom: 32px;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  opacity: 0.5;
}

.search-input {
  width: 100%;
  padding: 20px 24px 20px 56px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.search-input::placeholder {
  color: #94a3b8;
}

/* Categories List */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 32px;
  transition: all 0.4s ease;
  overflow: hidden;
}

.category-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: #c7d2fe;
}

.category-card.inactive {
  opacity: 0.6;
  filter: grayscale(0.5);
}

.category-row {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  gap: 20px;
}

.expand-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
}

.expand-btn:hover {
  background: #f1f5f9;
  color: #475569;
}

.category-image-wrapper {
  position: relative;
}

.category-image {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  object-fit: cover;
  background: #f1f5f9;
  border: 4px solid #f8fafc;
}

.status-dot {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 4px solid white;
}

.status-dot.active {
  background: #10b981;
}

.status-dot.inactive {
  background: #94a3b8;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.5px;
}

.hidden-badge {
  font-size: 10px;
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.category-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  font-size: 12px;
}

.slug-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-weight: 600;
}

.globe-icon {
  font-size: 12px;
  opacity: 0.6;
}

.slug-text {
  color: #6366f1;
  opacity: 0.7;
}

.divider {
  color: #e2e8f0;
}

.subcategory-count {
  color: #94a3b8;
  font-weight: 500;
}

.category-actions {
  display: flex;
  gap: 4px;
  background: rgba(241, 245, 249, 0.5);
  padding: 6px;
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.5);
}

.action-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.power-btn {
  color: #94a3b8;
}

.power-btn.active {
  color: #10b981;
}

.power-btn:hover {
  background: #ecfdf5;
}

.edit-btn {
  color: #94a3b8;
}

.edit-btn:hover {
  color: #6366f1;
  background: #eef2ff;
}

.delete-btn {
  color: #94a3b8;
}

.delete-btn:hover {
  color: #ef4444;
  background: #fef2f2;
}

/* Subcategories Panel */
.subcategories-panel {
  padding: 0 24px 32px 80px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-divider {
  height: 1px;
  background: #f1f5f9;
  margin-bottom: 24px;
}

.subcategories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.subcategory-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 16px;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.subcategory-card:hover {
  border-color: #c7d2fe;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.08);
}

.subcategory-card.inactive {
  opacity: 0.5;
  filter: grayscale(0.5);
}

.sub-image {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
  background: #f8fafc;
  border: 2px solid #f1f5f9;
}

.sub-info {
  flex: 1;
  min-width: 0;
}

.sub-name {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sub-id {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 700;
  margin: 4px 0 0 0;
  letter-spacing: 1px;
}

.sub-actions {
  display: flex;
  gap: 4px;
}

.sub-action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  color: #94a3b8;
}

.sub-action-btn.active {
  color: #10b981;
}

.sub-action-btn:hover {
  background: #f1f5f9;
}

.sub-action-btn.edit:hover {
  color: #6366f1;
  background: #eef2ff;
}

.sub-action-btn.delete:hover {
  color: #ef4444;
  background: #fef2f2;
}

.add-subcategory-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 2px dashed #e2e8f0;
  border-radius: 24px;
  padding: 16px;
  background: transparent;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-subcategory-btn:hover {
  color: #6366f1;
  border-color: #a5b4fc;
  background: rgba(238, 242, 255, 0.3);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 32px;
  border: 2px dashed #e2e8f0;
}

.empty-state p {
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow-y: auto;
}

.modal-container {
  background: white;
  border-radius: 40px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  padding: 32px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.modal-subtitle {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
  margin: 8px 0 0 0;
}

.modal-close-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border: none;
  border-radius: 50%;
  color: #94a3b8;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.modal-body {
  padding: 32px;
  max-height: 60vh;
  overflow-y: auto;
}

/* Image Upload */
.image-upload-section {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.image-upload-label {
  cursor: pointer;
}

.image-preview-container {
  width: 160px;
  height: 160px;
  border-radius: 40px;
  background: #f1f5f9;
  border: 4px solid white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

.image-preview-container:hover {
  transform: scale(1.02);
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  text-align: center;
}

.upload-icon {
  font-size: 40px;
  opacity: 0.3;
}

.upload-text {
  font-size: 10px;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 8px;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(99, 102, 241, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
}

.image-overlay span {
  color: white;
  font-size: 32px;
  font-weight: 300;
}

.image-preview-container:hover .image-overlay {
  opacity: 1;
}

.hidden-input {
  display: none;
}

/* Form Fields */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 11px;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-left: 4px;
}

.form-input {
  padding: 16px 24px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  outline: none;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.form-input::placeholder {
  color: #cbd5e1;
}

.slug-input-wrapper {
  position: relative;
}

.slug-prefix {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  opacity: 0.4;
}

.slug-input {
  padding-left: 48px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: #6366f1;
}

/* Toggle Section */
.toggle-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: #f8fafc;
  border-radius: 32px;
  border: 1px solid #f1f5f9;
}

.toggle-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toggle-icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  border-radius: 10px;
  color: #64748b;
  font-size: 16px;
  transition: all 0.3s ease;
}

.toggle-icon-wrapper.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.toggle-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.toggle-subtitle {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
  margin: 4px 0 0 0;
}

.toggle-switch {
  width: 56px;
  height: 32px;
  background: #cbd5e1;
  border: none;
  border-radius: 50px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-switch.active {
  background: #10b981;
}

.toggle-knob {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-switch.active .toggle-knob {
  left: calc(100% - 28px);
}

/* Modal Footer */
.modal-footer {
  padding: 32px;
  background: rgba(248, 250, 252, 0.5);
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 16px;
  border-radius: 0 0 40px 40px;
}

.cancel-btn {
  flex: 1;
  padding: 16px;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  color: #475569;
}

.save-btn {
  flex: 2;
  padding: 16px 32px;
  background: #6366f1;
  border: none;
  border-radius: 16px;
  color: white;
  font-weight: 800;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
}

.save-btn:hover {
  background: #4f46e5;
  transform: scale(1.02);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Delete Dialog */
.delete-dialog {
  background: white;
  border-radius: 48px;
  width: 100%;
  max-width: 400px;
  padding: 48px;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  animation: modalIn 0.3s ease;
}

.delete-icon-wrapper {
  width: 96px;
  height: 96px;
  background: #fef2f2;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32px;
  font-size: 48px;
  transform: rotate(-6deg);
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
}

.delete-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 16px 0;
}

.delete-message {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 500;
  margin: 0;
}

.delete-item-name {
  color: #ef4444;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-color: rgba(239, 68, 68, 0.2);
  text-underline-offset: 4px;
}

.delete-actions {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.confirm-delete-btn {
  width: 100%;
  padding: 20px;
  background: #ef4444;
  border: none;
  border-radius: 16px;
  color: white;
  font-weight: 800;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
}

.confirm-delete-btn:hover {
  background: #dc2626;
}

.keep-btn {
  width: 100%;
  padding: 20px;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.keep-btn:hover {
  color: #475569;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: #0f172a;
  color: white;
  padding: 20px 32px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  z-index: 2000;
  animation: toastIn 0.5s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.toast-icon {
  width: 32px;
  height: 32px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.toast-text {
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* Responsive */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .create-btn {
    width: 100%;
    justify-content: center;
  }
  
  .category-row {
    flex-wrap: wrap;
  }
  
  .category-info {
    width: 100%;
    order: 3;
    margin-top: 12px;
  }
  
  .category-actions {
    margin-left: auto;
  }
  
  .subcategories-panel {
    padding-left: 24px;
  }
  
  .subcategories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
