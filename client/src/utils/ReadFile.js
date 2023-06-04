export const ReadFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = reader.result;
            resolve(img);
        };
        reader.onerror = (error) => {
            console.log("Error", error);
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}