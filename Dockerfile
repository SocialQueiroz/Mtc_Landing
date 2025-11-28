FROM nginx:alpine

# apaga os arquivos padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# copia TUDO do projeto para a pasta pública
COPY . /usr/share/nginx/html

# nginx ouvindo na porta 80
EXPOSE 80
