<h1 align="center">imcDashboard ๐</h1>

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ykn9080/imcDashboard/LICENSE) 


> ๋์ฌ๋ณด๋๊ธฐ๋ฅ์ ์ ๊ณตํ๋ ์คํ์์ค. ์ฐจํธ,ํ์ด๋ธ,html๋ฌธ์ ๋ฑ์ drag & drop์ผ๋ก ๋ฐฐ์นํ  ์ ์๋ค. ๊ฐ ์ค๋ธ์ ํธ์ ๋ ์ด์์๊ณผ ์ฌ์ด์ฆ๋ณ๊ฒฝ์ ํ ์ ์์ผ๋ฉฐ. ๊ฐ๊ฐ์ ์ค๋ธ์ ํธ๋ฅผ ์์ฑ, ์์ , ์ญ์ ํ  ์ ์๋ค. 
> ์ฃผ์ ๋ณ๋ก ์ฌ๋ฌ๊ฐ์ ๋์ฌ๋ณด๋๋ ์์ฑํ  ์ ์๊ณ , ๋ฆฌ์คํธ๋ก ๊ด๋ฆฌํ  ์ ์๋ค. 
> 
<a href="http://imcmaster.iptime.org:7000" ><img src="https://i.ibb.co/744RYpb/imcdashboard.gif" width="800px"></a>

### โจ [Demo](http://imcmaster.iptime.org:7000)

[English](./README.md) | ํ๊ธ

## Install

```sh
# Github
git clone https://github.com/ykn9080/imcDashboard
npm start //local init
docker-compose up //using docker

# Docker
docker pull yknam/imcdashboard
docker run --name imcdashboard -p 7000:80 -d yknam/imcdashboard
```

## Usage basic

1. ์ ๊ท๋ก dashboard๋ฅผ ์์ฑํ๊ธฐ 
2. Save
3. Layout
4. Edit
 a. Chart
 b. Table
 c. HTML
4. Setting
 a. Localhost
  ์ํ ํ์ผ: sampledata.json
 b. Mongdb
5. Multiple dashboard


```js
 <AntFormDisplay
      showedit={true}
      formArray={formArray}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
    />
```

## EventHandler

1. onFinish: By clicking submit button, onFinish function returns a value as object.
   With this you can proceed other action, such as save to server or change state.
   Return data is key value object for example: {collection:"abc",querystring:"123",.....}
2. onValuesChange: returns two parameters, changedValues, allValues.
   First value return just changed key value object, last value returns all key value object.
   e.g.
   a. changedValues: {collection:"abc"},
   b. allValues:{collection:"abc",querystring:undefined.....}

```sh
 const onFinish = (val) => {
    console.log(val);
  };
  const onValuesChange = (changedValues, allValues) => {
    console.log(changedValues, allValues);
  };
```

## Sample data(formArray)

formArray is composed of two parts:

1. list: items in the form
2. setting: look and feel of the form

```sh
{
  "list": [
    {
      "label": "Collection",
      "name": "collection",
      "type": "input",
      "seq": 0,
      "placeholder": "database table",
      "rules": [
        {
          "required": false
        }
      ],
      "requiredmsg": "you must insert"
    },
    {
      "label": "QueryString",
      "name": "querystring",
      "type": "input",
      "seq": 1,
      "placeholder": "pid=xxxx or _id=yyyy",
      "msgright": "๋ผ์ดํธ ๋ฉ์์ง"
    },
    {
      "label": "Submit",
      "name": "",
      "type": "button",
      "seq": 7,
      "action": "submit",
      "btnStyle": "primary",
      "btnColor": "primary",
      "align": "right"
    }
  ],
 "setting": {
    "editable": false,
    "name": "antform",
    "layout": "horizontal",
    "formColumn": 1,
    "formItemLayout": {
      "labelCol": {
        "span": 4
      },
      "wrapperCol": {
        "span": 20
      }
    },
    "tailLayout": {},
    "initial": {},
    "size": "middle",
    "onFinish": "{values => {console.log(values);};}",
    "initialValues": {}
  },
 }
```

## Edit Form

If you provide pros as showedit={true} and click edit button, it redirect edit page.

[![FormEdit](https://i.ibb.co/ZhgW0SR/Imcformedit-small.png)](https://www.youtube.com/watch?v=_Fgp1g39Dc8 "Everything Is AWESOME")

 <iframe width="560" height="315"
src="https://www.youtube.com/embed/MUQfKFzIOeU" 
frameborder="0" 
allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
allowfullscreen></iframe>

## Author

๐ค **Youngki Nam**

- Website: http://imcmaster.iptime.org
- Github: [@ykn9080](https://github.com/ykn9080)

## Show your support

Give a โญ๏ธ if this project helped you!

---

_This README was generated with โค๏ธ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
