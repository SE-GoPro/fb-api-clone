# Response Codes List - Danh sách mã response

Những mã lỗi này trả về trong **response body**, chứ không phải là **HTTP Response Code**. Bổ sung mã lỗi chuẩn ở cột cuối cùng. Và đây là các mã response do môn học đề ra.

|Code|Message|Note|HTTP Code|
|-|-|-|-|
|1000|OK|OK|200|
|9992|Post is not existed|Bài viết không tồn tại|404|
|9993|Code verify is incorrect|Mã xác thực không đúng|401|
|9994|No Data or end of list data|Không có dữ liệu hoặc không còn dữ liệu|200 hoặc 204|
|9995|User is not validated|Không có người dùng này|400 hoặc 404|
|9996|User existed|Người dùng đã tồn tại|409|
|9997|Method is invalid|Phương thức không đúng|?|
|9998|Token is invalid|Sai token|401|
|9999|Exception Error|Lỗi exception (?)|500|
|1001|Cannot connect to DB|Lỗi mất kết nối DB hoặc lỗi thực thi câu lệnh SQL|400 hoặc 500|
|1002|Parameter is not enough|Số lượng tham số không đủ|400|
|1003|Parameter type is invalid|Kiểu tham số không đúng|400|
|1004|Parameter value is invalid|Giá trị của tham số không hợp lệ|400|
|1005|Unknown error|Lỗi không biết|500|
|1006|File size is too big|Cỡ file vượt mức cho phép|413|
|1007|Upload File Failed!|Upload thất bại|500|
|1008|Maximun number of images|Số lượng ảnh vượt quá quy định|400|
|1009|Not access|Không có quyền truy cập tài nguyên|403|
|1010|Action has been done previously by this user|Hành động đã được người dùng thực hiện trước đây|409(?)|
|1011|Could not publish this post|Bài đăng vi phạm tiêu chuẩn cộng đồng|?|
|1012|Limited access|Bài đăng bị giới hạn ở một số quốc gia|?|

> Củ chuối !
