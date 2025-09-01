export const AWS_CONSTANTS = {
    S3: {
        BUCKET_NAME: process.env.AWS_BUCKET || 'wit-local-test-uat',
        REGION: process.env.AWS_DEFAULT_REGION || 'ap-south-1',
        ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_MIME_TYPES: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'text/csv'
        ],
        ALLOWED_EXTENSIONS: [
            'jpg', 'jpeg', 'png', 'gif', 'webp',
            'pdf', 'doc', 'docx', 'xls', 'xlsx',
            'txt', 'csv'
        ]
    }
};

export const UPLOAD_PATHS = {
    PROFILE_IMAGES: 'profile-images',
    DOCUMENTS: 'documents',
    TEMP: 'temp',
    GENERAL: 'general'
}; 