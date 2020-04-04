# seal-merge-demo

## demo

[http://seal.ncj.wiki](http://seal.ncj.wiki)

## usage

```bash
cd src
npm install
npm start
```

## docker

### run

```bash
docker pull registry.cn-hangzhou.aliyuncs.com/ncj/seal-merge-demo:v1
docker run -p 8080:8080 -i registry.cn-hangzhou.aliyuncs.com/ncj/seal-merge-demo:v1
```

### build image

```bash
cd src
docker build . -t seal-merge-demo:v1
docker run -p 8080:8080 -i seal-merge-demo:v1
```