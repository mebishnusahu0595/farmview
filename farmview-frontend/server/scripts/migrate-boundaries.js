/**
 * Migration Script: Copy location.coordinates to boundary.coordinates
 * Run once to fix existing properties
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Property = require('../models/Property.model');

async function migrateBoundaries() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('📊 Finding properties without boundary coordinates...');
    
    const properties = await Property.find({
      $or: [
        { 'boundary.coordinates': { $exists: false } },
        { 'boundary.coordinates': { $size: 0 } },
        { 'boundary.coordinates.0': { $exists: false } }
      ]
    });

    console.log(`Found ${properties.length} properties to update`);

    let updated = 0;
    for (const property of properties) {
      if (property.location && property.location.coordinates && property.location.coordinates.length > 0) {
        property.boundary = {
          type: 'Polygon',
          coordinates: property.location.coordinates
        };
        await property.save();
        updated++;
        console.log(`✅ Updated property: ${property.propertyName || property._id}`);
      } else {
        console.log(`⚠️  Skipped property ${property._id} - no valid location coordinates`);
      }
    }

    console.log(`\n✅ Migration complete! Updated ${updated} properties`);
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateBoundaries();
