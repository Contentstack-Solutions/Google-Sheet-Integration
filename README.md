# Google Sheet Integration



# Prerequisites
- Basic understanding of JavaScript
- [Contentstack](https://app.contentstack.com/#!/login) account.
- Node.js version 14
- Lambda AWS Account

# Set Up Your App
This involves three steps:

1. Setting up your NodeJS Backend on Lambda. 
1. Setting up your Google App Script project.
1. Using the Google Sheet integration.
## 1. Setting up your NodeJS Backend on Lambda.
 Configure Your NodeJS Backend on Lambda To set up the backend, clone this [Github](https://github.com/Contentstack-Solutions/Google-Sheet-Backend-Code) repo  and proceed with the following steps.
 
1. Go to the directory  “backend”, and install node_modules. in that open terminal. Run the following command.

             npm install

2. The next step is to create a zip for our lambda function. Run the following command in your root folder.



             zip -r lambda.zip .

3. Following which, a zip file called **"lambda.zip"** will be created in the root directory.




4. Now go to your aws Lambda Function and click on "create function".

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt064978f9c7bf440c/62f3a03c57ac0577de0c08a1/Screenshot_2022-08-10_at_5.39.46_PM.png)

5. The next step is to select "runtime" as "Node.js 14x".

6. The next step is to upload **"lambda.zip"** on your aws acccount.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt331b92391f69af0a/62f3a1d018595876bf3187dc/Screenshot_2022-08-10_at_5.47.00_PM.png)

7. After that, we need to **Add trigger**.

 ![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt19add8dc1bfe50a8/62f3a35942380217691bfc75/Screenshot_2022-08-10_at_5.53.30_PM.png)

8. The next step is to "Select a source" as "API Gateway" after that in the "Intent" select "Create a new API", after that select "API type" as "REST API" after that select "Security" as "open".


## 2. Set up your Google App Script project.
To set up the integration, perform the following steps:

1. Go to directory  **“googleSheet/src”**

             cd googleSheet/src

2. You need to install Clasp to push the local code to Apps Script.

             npm install @google/clasp -g



3. After installing the Clasp, we need to log in using the below command.

             clasp login



4. Your terminal will open a tab in your browser. Select your Gmail account and click  ‘Allow’ for permissions.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt0eca2657a0875d5a/62a0899605f1d157f3a88606/cli.png)
















![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/bltaf812d7adf9366cb/62a089970ae1a75bf9d5d5e0/app_scripyt.png)


5. You will see an **“Authorization successful”** message on the terminal.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt913113fc3455f519/62a08d5496b55a5696224e0d/success.jpg) 










6. After this, you need to go to your  [App Script](https://script.google.com/u/1/home/usersettings) Settings.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt4d706a69a11ef0f3/62a09001e3bbf658a27e0013/settings.png)

7. Turn on the Google App Script API. 

8. In the next step, we are going to create our App Script Project from the terminal, add your title of project in the place of [scriptTitle]. 

              clasp create [scriptTitle]



9. After executing the above command, select **‘sheets’** as an option from the list below.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt18a8d9c20f7221e9/62a094871944ac5ac425e8be/select_script.jpg)








10.Your script was created successfully. It will show your addon link in the terminal.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt0a2859004c564d96/62a096052680af592233212c/successfuly_creted.jpg)




11. Now, we need to push the code on the previously created App Script Project. For this, use the following command. Executing this command will prompt the following question. type **’y’** to proceed.



              clasp push


![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/bltba51cf4b935a3a3e/62a097e4f4da744f1d8c545f/manifest.jpg)








12. Hurray!!! We have successfully pushed our App Script.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/bltf773ca708fa11958/62a099d9c949fd5059e8852e/pushed.jpg)





13. After successfully pushing the App script project, go to the Home.gs file.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blte564a1b458a1f1d9/629f8139a3e9730f695d1b23/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.003.png)

14. After the above step, just click on "Run."

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt42309be884e651e6/629f813924e98e0f7a831d13/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.004.png)





15. After running the file, it will ask us for permission.


![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/bltdf3be6cc17c0c41a/629f8139b86a794d785d6697/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.005.png)


16. After clicking on ‘**Review permissions**’, give the permission to the project.

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/blt13fea0e41fed3fd7/629f81397e445a4356bd8bab/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.006.jpeg)























![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/bltc174ccedff4d242a/629f813931e9d30f65bf1ca0/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.007.jpeg)

17. Next step is to add the link of your aws backend. In file **Branding.gs**

![](https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/bltd3b3d246244ad061/629f8139e2a136428b9a8c98/Aspose.Words.9d4b1670-1c6d-4297-bf63-e9fcd1521be5.008.png)


18. The next step is to click on deploy the project. After this select ‘**Test deployment**’. It will  open modal, click on install then click on done. Now your project has deployed on google cloud.

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
8. When you update something in a Google Sheet, you need to save those changed things first and then push them. Use **“ctrl+s”** to save them.










