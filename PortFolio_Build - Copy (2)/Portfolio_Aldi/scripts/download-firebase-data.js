// Script untuk download semua data dari Firebase
// Jalankan dengan: node scripts/download-firebase-data.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
  apiKey: "AIzaSyBJkRHH4NAOXBQHeI9s4lTk8kpUsJ69mdI",
  authDomain: "portofolio-web-e2543.firebaseapp.com",
  projectId: "portofolio-web-e2543",
  storageBucket: "portofolio-web-e2543.firebasestorage.app",
  messagingSenderId: "19818150866",
  appId: "1:19818150866:web:52be762a257434513be60b",
  measurementId: "G-HV3DW3RGER",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function downloadData() {
  console.log("🚀 Starting Firebase data download...\n");

  const outputDir = path.join(__dirname, "..", "public", "data");

  // Create output directory if not exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Download Projects
  console.log("📦 Downloading projects...");
  const projectsRef = collection(db, "projects");
  const projectsSnapshot = await getDocs(projectsRef);

  const projects = [];
  for (const docSnap of projectsSnapshot.docs) {
    const projectData = {
      id: docSnap.id,
      ...docSnap.data(),
    };

    // Get Contents subcollection
    const contentsRef = collection(docSnap.ref, "Contents");
    const contentsSnapshot = await getDocs(contentsRef);
    projectData.Contents = contentsSnapshot.docs.map((contentDoc) => ({
      id: contentDoc.id,
      ...contentDoc.data(),
    }));

    projects.push(projectData);
    console.log(`  ✓ Project: ${projectData.Title}`);
  }

  // Sort by Order descending
  projects.sort((a, b) => (b.Order || 0) - (a.Order || 0));

  fs.writeFileSync(
    path.join(outputDir, "projects.json"),
    JSON.stringify(projects, null, 2)
  );
  console.log(`✅ Saved ${projects.length} projects to projects.json\n`);

  // Download Tools
  console.log("🔧 Downloading tools...");
  const toolsRef = collection(db, "tools");
  const toolsSnapshot = await getDocs(toolsRef);

  const tools = [];
  for (const docSnap of toolsSnapshot.docs) {
    const toolData = {
      id: docSnap.id,
      ...docSnap.data(),
    };

    // Get Contents subcollection
    const contentsRef = collection(docSnap.ref, "Contents");
    const contentsSnapshot = await getDocs(contentsRef);
    toolData.Contents = contentsSnapshot.docs.map((contentDoc) => ({
      id: contentDoc.id,
      ...contentDoc.data(),
    }));

    tools.push(toolData);
    console.log(`  ✓ Tool: ${toolData.Title}`);
  }

  // Sort by Order descending
  tools.sort((a, b) => (b.Order || 0) - (a.Order || 0));

  fs.writeFileSync(
    path.join(outputDir, "tools.json"),
    JSON.stringify(tools, null, 2)
  );
  console.log(`✅ Saved ${tools.length} tools to tools.json\n`);

  console.log("🎉 All data downloaded successfully!");
  console.log(`📁 Data saved to: ${outputDir}`);

  process.exit(0);
}

downloadData().catch((error) => {
  console.error("❌ Error downloading data:", error);
  process.exit(1);
});
