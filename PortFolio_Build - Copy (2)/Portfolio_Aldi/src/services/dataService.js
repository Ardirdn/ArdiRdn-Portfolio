// Local data service - menggantikan Firebase
// Data diambil dari file JSON lokal di /public/data/

export const fetchProjects = async () => {
    try {
        const response = await fetch('/data/projects.json');
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        const projects = await response.json();
        return projects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
};

export const fetchTools = async () => {
    try {
        const response = await fetch('/data/tools.json');
        if (!response.ok) {
            throw new Error('Failed to fetch tools');
        }
        const tools = await response.json();
        return tools;
    } catch (error) {
        console.error('Error fetching tools:', error);
        return [];
    }
};

export const fetchProjectById = async (id) => {
    try {
        const projects = await fetchProjects();
        const project = projects.find(p => p.id === id);
        if (!project) {
            throw new Error(`Project with id ${id} not found`);
        }
        return project;
    } catch (error) {
        console.error('Error fetching project by id:', error);
        return null;
    }
};

export const fetchToolById = async (id) => {
    try {
        const tools = await fetchTools();
        const tool = tools.find(t => t.id === id);
        if (!tool) {
            throw new Error(`Tool with id ${id} not found`);
        }
        return tool;
    } catch (error) {
        console.error('Error fetching tool by id:', error);
        return null;
    }
};

export const fetchLevelDesigns = async () => {
    try {
        const response = await fetch('/data/leveldesigns.json');
        if (!response.ok) {
            throw new Error('Failed to fetch level designs');
        }
        const levelDesigns = await response.json();
        return levelDesigns;
    } catch (error) {
        console.error('Error fetching level designs:', error);
        return [];
    }
};

export const fetchLevelDesignById = async (id) => {
    try {
        const levelDesigns = await fetchLevelDesigns();
        const levelDesign = levelDesigns.find(l => l.id === id);
        if (!levelDesign) {
            throw new Error(`Level design with id ${id} not found`);
        }
        return levelDesign;
    } catch (error) {
        console.error('Error fetching level design by id:', error);
        return null;
    }
};

export const fetch3DShowcase = async () => {
    try {
        const response = await fetch('/data/3dshowcase.json');
        if (!response.ok) {
            throw new Error('Failed to fetch 3d showcase');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching 3d showcase:', error);
        return [];
    }
};

export const fetch3DItemById = async (id) => {
    try {
        const items = await fetch3DShowcase();
        const item = items.find(i => i.id === id);
        if (!item) {
            throw new Error(`3D Item with id ${id} not found`);
        }
        return item;
    } catch (error) {
        console.error('Error fetching 3d item by id:', error);
        return null;
    }
};
