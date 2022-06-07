export const getImageMock = (): Express.Multer.File => {
  return {
    filename: "test.jpg",
    originalname: "test.jpg",
    mimetype: "image/jpg",
    size: 1024,
  } as Express.Multer.File;
};
