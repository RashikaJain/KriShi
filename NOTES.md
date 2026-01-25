# Status codes

400 => bad request

500 => internal server Error

502  => another server failed

# How image uploads travels from frontend to backend 

the image when is sent from the frontend to backend => it is sent to multer middleware 

## MULTER:
Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. 

### NOTE
 Multer will not process any form which is not multipart


# What is Multer?

Multer is a middleware for Node.js (Express) that handles
👉 file uploads (images, videos, PDFs, etc.)

It reads files coming from:

<form enctype="multipart/form-data">


and makes them available in:

req.file   // single file
req.files  // multiple files

Why we use Multer (real-world reasons)

Without Multer:
Express cannot understand file data.

With Multer, you can:

Upload profile pictures

Upload resumes

Upload product images

Upload videos

Upload documents

# HOW MULTER WORKS WITH THE CLOUDINARY 

How Multer works with Cloudinary (real architecture)

Multer’s job:

Read the file from the incoming request

Make it available as req.file

Cloudinary’s job:

Take that file

Upload it to cloud storage

Return a public URL

So the pipeline looks like this:

Client → Multer → req.file → Cloudinary → URL → Save URL in DB

# Can not we directly upload it on mongoDB if we don't use the cloudinary?

Yes, you can store images directly in MongoDB.
But smart engineers almost never do it for real products. Here’s the clear picture.

How images can be stored in MongoDB

MongoDB has two ways:

1. Store image as Binary (Buffer/Base64)

You literally save the file inside a document.

image: {
  data: Buffer,
  contentType: "image/png"
}

2. Use GridFS (MongoDB’s file storage system)

GridFS splits large files into chunks and stores them across collections.

So technically:

Image lives inside MongoDB storage.

Why this sounds simple but becomes a problem
If you store images in MongoDB:
User uploads image
→ Backend converts to buffer
→ MongoDB stores huge binary data
→ DB size grows fast
→ Queries slow down
→ Backups become heavy
→ Performance drops


Databases are built for structured data, not heavy media.

Real-world comparison

Think like this:

System	What it is good for
MongoDB	Text, users, orders, posts, metadata
Cloudinary / S3	Images, videos, PDFs, large files
CDN	Fast global delivery of media

Storing images in MongoDB is like:

Using Excel to edit videos.
Possible? Yes.
Smart? No.

When storing in MongoDB is acceptable

You can do it if:

Small college project

Very few images

Internal tool

Learning purpose

Prototype

Avoid it if:

Public app

Many users

Production deployment

Anything scalable

Simple architecture comparison
MongoDB image storage
Backend → MongoDB (text + users + images all together)
Heavy DB
Slow queries
Hard scaling

Cloudinary storage
Backend → MongoDB (only URLs + data)
Backend → Cloudinary (images)
Fast DB
Easy scaling
Clean architecture

# API FOR GETTING CITY NAME
Geoapify => helps in retrieving the location of the user

# What populate() does in MongoDB (Mongoose)

populate() replaces an ObjectId reference with the actual document data from another collection.

Think of it like a JOIN in SQL.

# MULTER UPLOAD
upload.single("image") in this image is the name of the pic jo hm frontend se bhejenge mtlb hm frontend de hi image ke andr image ko send krenge