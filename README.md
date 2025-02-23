# T3A2 Part B Server

## Models:
Created the following JS files to the models folder:

UserModel:

    - UserSchema:

        Fields:
        - accountEmail
        - password
        - firstname
        - lastname
        - userEmail
        - phonenumber
        - admin
        - avatar
        - userImage
        - age

GiftListModel:

    - childGiftSchema:

        Fields:
        - giftName
        - giftDescription
        - giftImage
        - giftWebAddress

    - GiftListSchema:

        Fields:
        - giftListTitle
        - giftListImage
        - childUser
        - childGiftList
        - userCreated
        - privateList
        - dateCreated
        - dateEvent