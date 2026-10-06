import mongoose from 'mongoose';
import { Content } from '../server/models.js';

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const defaultHero = {
      aboutLabel: "ABOUT US:",
      aboutText: "AT KITVERSE WE LIVE AND BREATHE FOOTBALL ARCHIVE CULTURE. WE ARE NOT MERELY ENTHUSIASTS; WE ARE STORYTELLERS OF KITVERSE LEGACY.",
      title: "MATCHDAY ARCHIVE",
      subtitle: "2024 / 2025 REVEAL SPECIFICATION",
      registry: "REGISTRY // FROM 2024",
      headline: "ENGINEERED FOR THE MODERN ICON",
      cta: "EXPLORE THE ARCHIVE"
    };

    const defaultAnnouncement = {
      text: "FREE SHIPPING ON ORDERS OVER ₹1500 / USE CODE EXTRA10 FOR 10% OFF",
      isActive: true
    };
    
    await Content.updateOne(
      { key: 'homepage-hero' },
      { $setOnInsert: { draftValue: defaultHero, publishedValue: defaultHero, history: [] } },
      { upsert: true }
    );
    
    await Content.updateOne(
      { key: 'announcement-bar' },
      { $setOnInsert: { draftValue: defaultAnnouncement, publishedValue: defaultAnnouncement, history: [] } },
      { upsert: true }
    );

    console.log('Seeded Content successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

