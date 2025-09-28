export default function envVar(key:string) {
    if (!key.toUpperCase().startsWith("VITE_"))
        key = `VITE_${key}`;
    
    const varKey = `${key.toUpperCase()}`;
    
    const val = import.meta.env[varKey];

    return val;
}

export function imageUrl(fileName:String) {
    return envVar('S3_IMAGES_FOLDER') + fileName;
}
