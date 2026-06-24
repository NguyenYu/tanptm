/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Thêm dòng này để xuất ra file tĩnh (.html)
    images: {
        unoptimized: true, // Bắt buộc nếu trong dự án anh có dùng thẻ <Image /> của Nextjs
    },
    trailingSlash: true, // Giúp Next.js tạo ra cấu trúc file rõ ràng
    reactCompiler: true,
};

export default nextConfig;
