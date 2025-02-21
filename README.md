# T3A2 Part B Server

## Models:
Created the following JS files to the models folder:

UserModel:

    - UserSchema:

        Fields:
        - email
        - password
        - firstname
        - lastname
        - phonenumber
        - admin
        - avatar
        - userImage
        - age

GiftListModel:

    - childGiftSchema:

        Fields:
        - childGift
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
        - dateCreated
        - dateExpired