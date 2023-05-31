import RNFS from 'react-native-fs';

class Constant {
  //static BASE_URL = 'http://3.85.166.62:8000/';
  static BASE_URL = 'http://139.59.6.220:8000/';
  //static BASE_URL ='https://mountainhomestays.app/'
  //static Base_URL ='https://homestay.graycelltech.in/'
  static API_URL =  Constant.BASE_URL + 'api/';
  static Gallery_Images_URL = Constant.BASE_URL + 'AppImages/Location/';
  static Main_Images_URL = Constant.BASE_URL + 'AppImages/Location/Main/';
  static Map_Images_URL = Constant.BASE_URL + 'AppImages/Location/Map/';
  static Main_Images_Item_URL = Constant.BASE_URL + 'AppImages/ItemMain/';
  static Gallery_HomeStay_Images_URL = Constant.BASE_URL + 'AppImages/HomeStay/';
  static Gallery_HomeStay_MainImage_Images_URL = Constant.BASE_URL + 'AppImages/HomeStay/Main/';
  static QrCode_Images_URL = Constant.BASE_URL + 'AppImages/QRCode/';
  static Homestay_MainImage_Url = Constant.BASE_URL + 'AppImages/HomeStay/Main/';
  static StateImage_Url = Constant.BASE_URL + 'AppImages/State/';
  static CityImage_Url = Constant.BASE_URL + 'AppImages/City/';
  static OwnerImage_Url = Constant.BASE_URL + 'AppImages/OwnerImage/';

  static Base_URL_Local=`${RNFS.DocumentDirectoryPath}/`;
  static FileDisplay_Prefix_Local='file://';
  static StateImage_Url_Local = Constant.Base_URL_Local + 'stateImages/';
  static CityImage_Url_Local = Constant.Base_URL_Local + 'cityImages/';
  static LocationImage_Url_Local = Constant.Base_URL_Local + 'locationImages/';
  static LocationGalleryImage_URL_Local = Constant.Base_URL_Local + 'locationGalleryImages/';
  static LocationItemImage_URL_Local = Constant.Base_URL_Local + 'locationItemImages/';
  static Map_Images_URL_Local = Constant.Base_URL_Local + 'locationMap/';
  static Gallery_HomeStay_MainImage_Images_URL_Local = Constant.Base_URL_Local + 'homeStayImages/';
  static Gallery_HomeStay_Images_URL_Local = Constant.Base_URL_Local + 'homeStayGalleryImages/';
  static Homestay_MainImage_Url_Local = Constant.Base_URL_Local + 'homeStayHostImages/';
  static OwnerImage_Url_Local = Constant.Base_URL_Local + 'homeStayOwnerImage/';
  static CKEditor_ItemImage_URL_Local = Constant.Base_URL_Local + 'ckeditorItemImages/';
  static QrCode_Images_URL_Local = Constant.Base_URL_Local + 'qrCodeImage/';
}

export default Constant;