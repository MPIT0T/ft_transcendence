FROM debian:12

RUN apt update && apt install -y nginx openssl

COPY config/nginx.conf etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
