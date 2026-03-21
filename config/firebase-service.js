/**
 * Firebase Service - Data layer for properties
 * This acts as an abstraction layer that can be swapped with real Firebase later
 */

const fs = require('fs');
const path = require('path');

class FirebaseService {
  constructor() {
    this.propertiesFile = path.join(__dirname, '../data/properties.json');
    this.properties = [];
    this.nextId = 1;
    this.loadProperties();
  }

  /**
   * Load properties from JSON file
   */
  loadProperties() {
    try {
      if (fs.existsSync(this.propertiesFile)) {
        const data = fs.readFileSync(this.propertiesFile, 'utf8');
        this.properties = JSON.parse(data);
        // Find max ID for nextId
        this.nextId = Math.max(...this.properties.map(p => p.id || 0), 0) + 1;
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      this.properties = [];
    }
  }

  /**
   * Save properties to JSON file
   */
  saveProperties() {
    try {
      fs.writeFileSync(
        this.propertiesFile,
        JSON.stringify(this.properties, null, 2),
        'utf8'
      );
    } catch (error) {
      console.error('Error saving properties:', error);
    }
  }

  /**
   * Get all properties with filtering
   */
  getAllProperties(filters = {}) {
    let result = [...this.properties];

    if (filters.city) {
      result = result.filter(p => p.city.toLowerCase() === filters.city.toLowerCase());
    }
    if (filters.type) {
      result = result.filter(p => p.type === filters.type);
    }
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters.approval_status) {
      result = result.filter(p => p.approval_status === filters.approval_status);
    }
    if (filters.minPrice) {
      result = result.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(search) ||
        p.address.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    return result;
  }

  /**
   * Get property by ID
   */
  getPropertyById(id) {
    return this.properties.find(p => p.id === parseInt(id));
  }

  /**
   * Create new property
   */
  createProperty(propertyData) {
    const newProperty = {
      id: this.nextId++,
      ...propertyData,
      approval_status: propertyData.approval_status || 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.properties.push(newProperty);
    this.saveProperties();
    return newProperty;
  }

  /**
   * Update property
   */
  updateProperty(id, updates) {
    const property = this.getPropertyById(id);
    if (!property) return null;

    const updated = {
      ...property,
      ...updates,
      id: property.id, // Don't change ID
      created_at: property.created_at, // Keep original creation date
      updated_at: new Date().toISOString()
    };

    const index = this.properties.findIndex(p => p.id === id);
    this.properties[index] = updated;
    this.saveProperties();
    return updated;
  }

  /**
   * Delete property
   */
  deleteProperty(id) {
    const index = this.properties.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;

    this.properties.splice(index, 1);
    this.saveProperties();
    return true;
  }

  /**
   * Approve property
   */
  approveProperty(id) {
    return this.updateProperty(id, {
      approval_status: 'approved'
    });
  }

  /**
   * Reject property
   */
  rejectProperty(id) {
    return this.updateProperty(id, {
      approval_status: 'rejected'
    });
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalProperties: this.properties.length,
      pendingProperties: this.properties.filter(p => p.approval_status === 'pending').length,
      approvedProperties: this.properties.filter(p => p.approval_status === 'approved').length,
      rejectedProperties: this.properties.filter(p => p.approval_status === 'rejected').length,
      forSale: this.properties.filter(p => p.status === 'sale').length,
      forRent: this.properties.filter(p => p.status === 'rent').length,
      byCity: this._groupByCity(),
      byType: this._groupByType()
    };
  }

  /**
   * Helper to group properties by city
   */
  _groupByCity() {
    const cities = {};
    this.properties.forEach(p => {
      cities[p.city] = (cities[p.city] || 0) + 1;
    });
    return cities;
  }

  /**
   * Helper to group properties by type
   */
  _groupByType() {
    const types = {};
    this.properties.forEach(p => {
      types[p.type] = (types[p.type] || 0) + 1;
    });
    return types;
  }

  /**
   * Bulk update properties
   */
  bulkUpdateProperties(ids, updates) {
    return ids.map(id => this.updateProperty(id, updates)).filter(p => p !== null);
  }

  /**
   * Bulk delete properties
   */
  bulkDeleteProperties(ids) {
    let deleted = 0;
    ids.forEach(id => {
      if (this.deleteProperty(id)) deleted++;
    });
    return deleted;
  }
}

// Export singleton instance
module.exports = new FirebaseService();
