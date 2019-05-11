const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const config = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION
};

const uploadFile = (file, bucket, key) => {
  const s3 = new aws.S3(config);
  fs.readFile(file, (err, data) => {
    if (err) console.log(err);
    const base64data = new Buffer.from(data, "base64");
    const params = {
      Bucket: bucket,
      Key: key,
      Body: base64data
    };
    s3.upload(params, (err, data) => {
      if (err) console.log(err);
      console.log("Upload Completed");
    });
  });
};

const downloadFile = async (file, bucket, key) => {
  const s3 = new aws.S3(config);
  var params = {
    Bucket: bucket,
    Key: key
  };
  let fileS3 = fs.createWriteStream(file);
  return new Promise((resolve, reject) => {
    s3.getObject(params)
      .createReadStream()
      .on("end", () => {
        return resolve();
      })
      .on("error", error => {
        return reject(error);
      })
      .pipe(fileS3);
  });
};

const encode64 = file => {
  const image = fs.readFileSync(file);
  return new Buffer.from(image, "base64");
};

const decode64 = (base64str, file) => {
  const image = new Buffer.from(base64str, "base64");
  fs.writeFileSync(file, image);
};

const bucket = process.env.BUCKET_NAME;
const fileUpload = path.resolve(__dirname, "..", "data", "uploads", "file.png");
const fileDownload = path.resolve(
  __dirname,
  "..",
  "data",
  "downloads",
  "file.png"
);
const fileDownload64 = path.resolve(
  __dirname,
  "..",
  "data",
  "downloads",
  "file-64.png"
);
const key = `file-${(+new Date()).toString(36)}.png`;

//uploadFile(fileUpload, bucket, key);

downloadFile(fileDownload, bucket, "file-jvjir26i.png").then(() => {
  const base64 = encode64(fileDownload);
  console.log(base64);
  decode64(base64, fileDownload64);
});
