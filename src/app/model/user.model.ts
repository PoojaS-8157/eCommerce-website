export class RegisterUser {
  CustId: number
  Name: string
  MobileNo: string
  Password: string

  constructor(CustId: number, Name: string, MobileNo: string, Password: string) {
    this.CustId = CustId;
    this.Name = Name;
    this.MobileNo = MobileNo;
    this.Password = Password;
  }

  get name(): string {
    return this.Name;
  }
}

export interface ICartItem {
  CartId: number
  CustId: number
  ProductId: number
  Quantity: number
  AddedDate: string
}

export interface ILoginUser {
  UserName: string
  UserPassword: string
}

export interface ICartItemDetails {
  cartId: number
  custId: number
  productId: number
  quantity: number
  productShortName: string
  addedDate: string
  productName: string
  categoryName: string
  productImageUrl: string
  productPrice: number
}