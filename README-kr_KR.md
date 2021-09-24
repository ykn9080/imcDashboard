<h1 align="center">imcDashboard 👋</h1>

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ykn9080/imcDashboard/LICENSE) 


> 대쉬보드기능을 제공하는 오픈소스. 차트,테이블,html문서 등을 drag & drop으로 배치할 수 있다. 각 오브젝트의 레이아웃과 사이즈변경을 할수 있으며. 각각의 오브젝트를 생성, 수정, 삭제할 수 있다. 
> 주제별로 여러개의 대쉬보드는 생성할 수 있고, 리스트로 관리할 수 있다. 
> 
<a href="http://imcmaster.iptime.org:7000" ><img src="https://i.ibb.co/744RYpb/imcdashboard.gif" width="800px"></a>

### ✨ [Demo](http://imcmaster.iptime.org:7000)

[English](./README.md) | 한글

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

1. 신규로 dashboard를 생성하기 
2. Save
3. Layout
4. Edit
 a. Chart
 b. Table
 c. HTML
4. Setting
 a. Localhost
  샘플 파일: sampledata.json
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
      "msgright": "라이트 메시지"
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

👤 **Youngki Nam**

- Website: http://imcmaster.iptime.org
- Github: [@ykn9080](https://github.com/ykn9080)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
