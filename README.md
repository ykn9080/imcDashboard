<h1 align="center">imcDashboard 📌</h1>

![npm](https://img.shields.io/npm/v/imcformbuilder)
![npm bundle size](https://img.shields.io/bundlephobia/min/imcformbuilder?style=plastic)
![npm](https://img.shields.io/npm/dm/imcformbuild)

> Create and deploy various objects, such as chart, table, html in a dashboard and rearrange position, change each object size.
> You can manage multiple dashboard by subjects and load each dashboard from list.

> | Display                                                                                                               | Form Edit                                                                                                           |
> | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
> | <a href="http://imcmaster.iptime.org/form" ><img src="https://i.ibb.co/7yWH0tT/antformdisplay.png" width="400px"></a> | <a href="http://imcmaster.iptime.org:3080" ><img src="https://i.ibb.co/RNbtwWF/imcformedit.png" width="400px"> </a> |

### 🏠 [Homepage](http://imcmaster.iptime.org:3080)

### ✨ [Demo](http://imcmaster.iptime.org:4009/form/edit)

## Install

```sh
npm install formbuilder
```

## Usage basic

While you develop, showedit={true} will show you edit button.
Upon complete development, change showedit to false to hide button.

```sh
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
