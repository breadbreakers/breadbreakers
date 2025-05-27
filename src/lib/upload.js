export async function uploadFile(file, label, itemId) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("itemId", itemId);
    formData.append("label", label);

    const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
    });
    const uploadResult = await uploadRes.json();
    if (!uploadRes.ok) {
        throw new Error(uploadResult.error || "File upload failed");
    }
    return uploadResult.fileUrl || uploadResult.fileId;
}