# Google Sheet Integration



# Prerequisites
- Basic understanding of JavaScript
- [Contentstack](https://app.contentstack.com/#!/login) account.
- Node.js version 12 or later.
- Lambda AWS Account

# Set Up Your App
This involves three steps:

1. Setting up your NodeJS Backend on Lambda. 
1. Setting up your Google App Script project.
1. Using the Google Sheet integration.
## 1. Setting up your NodeJS Backend on Lambda.
 Configure Your NodeJS Backend on Lambda To set up the backend, clone this [Github](https://github.com/Contentstack-Solutions/Google-Sheet-Backend-Code) repo  and proceed with the following steps.

1. After cloning the github repo, go to the **"backend/utils/config.js"**  file, and update the **“FILESYSTEM\_BASE\_PATH”** and add your AWS EFS Path. (Note: the folder name is “Contents.” Don't change it.) 

     ![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt2c40a320856ab64b/629f81599bb72a0f7439f53e/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.001.jpeg)





1. The next step is to install node\_modules, for that open terminal. Run the following command.

             npm install

1. The next step is to create a zip for our lambda function. Run the following command in your root folder.



             zip -r lambda.zip .

1. Following which, a zip file called **"lambda.zip"** will be created in the root directory.

1. Upload that zip file to AWS Lambda.

## 2. Set up your Google App Script project.
To set up the integration, log into your Google [Apps Script](https://script.google.com/home) account and proceed with the   following steps:

1. Go to the Shared  [Apps Script](https://script.google.com/home) Project and click on an OverView to make a copy of the  project.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt9d54f02e047c027d/629f8139ae6f0e4156d1ad34/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.002.png)

2. After successfully copying the project, go to the Home.gs file.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blte564a1b458a1f1d9/629f8139a3e9730f695d1b23/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.003.png)

3. After the above step, just click on "Run."

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt42309be884e651e6/629f813924e98e0f7a831d13/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.004.png)





4. After running the file, it will ask us for permission.


![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/bltdf3be6cc17c0c41a/629f8139b86a794d785d6697/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.005.png)


5. After clicking on ‘**Review permissions**’, give the permission to the project.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt13fea0e41fed3fd7/629f81397e445a4356bd8bab/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.006.jpeg)























![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/bltc174ccedff4d242a/629f813931e9d30f65bf1ca0/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.007.jpeg)

6. Next step is to add the link of your aws backend. In file **Branding.gs**

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/bltd3b3d246244ad061/629f8139e2a136428b9a8c98/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.008.png)


7. The next step is to click on deploy the project. After this select ‘**Test deployment**’. It will  open modal, click on install then click on done. Now your project has deployed on google cloud.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/bltbef437acb6a2fdbe/629f8139c1a31f435ce9d78d/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.009.png)

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/bltff43770f12e49de3/629f81391a5eff4c4c37b191/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.010.png)














## 3. Start Using the Google Sheet integration
To start using it, just open any [spreadsheet](https://docs.google.com/spreadsheets/u/0/). In the add-ons it will start showing Contentstack Google Integration.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt4d79b7143a823dd2/629f81395711a40f708cc735/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.011.png)



1. Click on the Content Stack logo and click on the login button. It will open a new slider bar for login. Add contentstack credentials and click on the login button.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt9db6aa9713b14c60/629f85a53d4e745ed3ae6155/chrome-capture-2022-4-26.gif)


2. After logging in, the Contentstack slider bar will close. Click on the logo again. Then select your organization, then select stack, and then select content type.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt2f06a50513216bf9/629f85a7dd28e20f45d63e14/CPT2205261335-1832x932_(1)_(1).gif)



3. Select the locale, then fetch the data. 


![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt42772d05da194440/629f85a77e445a4356bd8bbb/chrome-capture-2022-4-26_(2).gif)


4. After fetching the data, you need to update it. There is a column called 'Updated' which contains the boolean values. We need to set it to **true** to 'Update  Entry Operation'. No need to set the boolean values for 'Create Entry Operation'.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/bltd6948f10527664f4/629f8a0c0d3e0c2148fe637c/chrome-capture-2022-5-2.gif)

5. Once the data is pushed, you need to fetch the updated data again. 

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/bltebd7e13359f9c8d0/629f8a939bb72a0f7439f5f0/chrome-capture-2022-5-2_(1).gif)

## 4. Please Note -
1. Currently, we are not providing the support to upload assets from integration. We will work on this in Phase Two.
2. When we go to an empty content type (entries not created), it will fetch all the fields from the content type that is present, so checkBox does not work for empty content types.
3. We are not able to provide the support to manage routes in this extension.
4. The search field is cleared after the search is successful. (App Script does not support search fields).
5. No need to set an updated boolean value for creation. When creating the entry, do not add anything in the uid field.
6. When you create an entry in the sheet, don't add blank cells to the sheet. If you add a blank cell in the sheet, it will create a new entry, because the title field is not required in Contentstack. 
7. When you update json RTE, there is a column called 'json.children'. in that column you can add html or text.












