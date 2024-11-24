CC18 Fakebook api
---
user bobby@ggg.mail
pass 123456
### env guide
PORT=8899
DATABASE_URL="mysql://root:008800@localhost:3306/cc18_fakebook"

JWT_SECRET=qwert


CLOUDINARY_NAME = dvrgra6z8
CLOUDINARY_API_KEY = 586858385166257
CLOUDINARY_API_SECRET = FkGBShbQa3Nmj-26qnjKhcgzncg
---
### service 

|method |path |authen | params | query | body |
|:----- |:--- |:----:  |:------ |:----- |:---- |
|post|/auth/register|-|-|-|{ identity,firstName, lastName, password, confirmPassword }
|post|/auth/login|-|-|-|{ identity, password }
|get|/auth/me|y|-|-|-|
|get|/post|y|-|-|-|
|post|/post|y|-|-|{message, image(file)}
|put|/post|y|:id|-|{message, image(file)}
|delete|/post|y|:id|-|-
|post|/comment|y|-|-|{message, postId} 
|post|/like|y|-|-|{postId}
|delete|/like|y|:id|-|-


---
## Note
## create route & controller for /post (16:10)






