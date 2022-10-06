import multer from 'multer'

const storage = multer.diskStorage({
    destination: 'uploads'
});
export default multer({storage});