using MongoDB.Bson;
using MongoDB.Driver;
using StoreAPI.Models;
//using StorePOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StoreAPI.Services
{
    public class StoreService
    {
        private readonly IMongoCollection<Store> _stores;
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<Role> _roles;
        private readonly IMongoCollection<Stock> _stocks;
        private readonly IMongoCollection<Sale> _sales;
        private readonly IMongoCollection<SalesDetail> _salesDetails;
        private readonly IMongoCollection<Product> _products;
        private readonly IMongoCollection<Pos> _pos;
        private readonly IMongoCollection<Payment> _payments;
        private readonly IMongoCollection<PaymentType> _paymentTypes;
        private readonly IMongoCollection<Family> _families;
        private readonly IMongoCollection<Photo> _photos;

        public StoreService(IDatabaseSettings settings, ICollectionNames collections)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _stores = database.GetCollection<Store>(collections.StoresCollection);
            _users = database.GetCollection<User>(collections.UsersCollection);
            _roles = database.GetCollection<Role>(collections.RolesCollection);
            _stocks = database.GetCollection<Stock>(collections.StocksCollection);
            _sales = database.GetCollection<Sale>(collections.SalesCollection);
            _salesDetails = database.GetCollection<SalesDetail>(collections.SalesDetailsCollection);
            _products = database.GetCollection<Product>(collections.ProductsCollection);
            _pos = database.GetCollection<Pos>(collections.PosCollection);
            _payments = database.GetCollection<Payment>(collections.PaymentsCollection);
            _paymentTypes = database.GetCollection<PaymentType>(collections.PaymentTypesCollection);
            _families = database.GetCollection<Family>(collections.FamiliesCollection);
            _photos = database.GetCollection<Photo>(collections.PhotosCollection);
        }
        //  Stores collection
        public List<Store> GetStores() =>
            _stores.Find(store => true).ToList();

        public Store GetStore(string id) =>
            _stores.Find(store => store.Id == id).FirstOrDefault();

        public Store CreateStore(Store store)
        {
            _stores.InsertOne(store);
            return store;
        }

        public void UpdateStore(string id, Store storeIn)
        {
            var store = _stores.Find(store => store.Id == id).FirstOrDefault();
            storeIn.Id = store.Id;
            _stores.ReplaceOne(store => store.Id == id, storeIn);
        }

        public void RemoveStore(Store storeIn) =>
            _stores.DeleteOne(store => store.Id == storeIn.Id);

        public void RemoveStore(string id) =>
            _stores.DeleteOne(store => store.Id == id);

        //  Users collection
        public List<User> GetUsers() =>
            _users.Find(user => true).ToList();

        public User GetUser(Guid id) =>
            _users.Find(user => user.Id == id).FirstOrDefault();

        public User GetUserByEmail(string email) =>
            _users.Find(user => user.Email == email).FirstOrDefault();

        public User GetUserByName(string name) =>
            _users.Find(user => user.UserName == name).FirstOrDefault();

        public User GetUserByToken(string token) =>
            _users.Find(user => user.Token == token).FirstOrDefault();

        public User CreateUser(User user)
        {
            _users.InsertOne(user);
            return user;
        }

        public void UpdateUser(Guid id, User userIn)
        {
            var user = _users.Find(user => user.Id == id).FirstOrDefault();
            userIn.Id = user.Id;
            _users.ReplaceOne(user => user.Id == id, userIn);
        }

        public void RemoveUser(User userIn) =>
            _users.DeleteOne(user => user.Id == userIn.Id);

        public void RemoveUser(Guid id) =>
            _users.DeleteOne(user => user.Id == id);

        public List<Role> GetRoles() =>
            _roles.Find(role => true).ToList();

        public Role GetRoleByName(string name) =>
            _roles.Find(role => role.Name == name).FirstOrDefault();

        public Role CreateRole(Role role)
        {
            _roles.InsertOne(role);
            return role;
        }

        public User AddRole(Guid id, Role role)
        {
            var userIn = _users.Find(user => user.Id == id).FirstOrDefault();
            userIn.Roles.Add(role.Id);
            _users.ReplaceOne(user => user.Id == id, userIn);
            return userIn;
        }

        public void RemoveRoleByName(string name) =>
            _roles.DeleteOne(role => role.Name == name);

        //  Stocks collection
        public List<Stock> GetStocks() =>
            _stocks.Find(stock => true).ToList();

        public Stock GetStock(string id) =>
            _stocks.Find(stock => stock.StockId == id).FirstOrDefault();

        public Stock CreateStock(Stock stock)
        {
            _stocks.InsertOne(stock);
            if (stock.StoreId != null)
            {
                Store storeIn = _stores.Find(store => store.Id == stock.StoreId).FirstOrDefault();
                storeIn.Stocks.Add(stock);
                _stores.ReplaceOne(store => store.Id == storeIn.Id, storeIn);
            }
            if (stock.ProductId != "")
            {
                Product productIn = _products.Find(product => product.ProductId == stock.ProductId).FirstOrDefault();
                productIn.Stocks.Add(stock);
                _products.ReplaceOne(product => product.ProductId == productIn.ProductId, productIn);
            }
            return stock;
        }

        public void UpdateStock(string id, Stock stockIn)
        {
            Stock oldStock = _stocks.Find(stock => stock.StockId == id).FirstOrDefault();
            stockIn.StockId = oldStock.StockId;
            if ((stockIn.StoreId != oldStock.StoreId && stockIn.StoreId != "") || (stockIn.ProductId != oldStock.ProductId && stockIn.ProductId != ""))
            {
                //  Update Store
                Store oldStore = _stores.Find(store => store.Id == oldStock.StoreId).FirstOrDefault();
                oldStore.Stocks.Remove(oldStore.Stocks.First(stock => stock.StockId == oldStock.StockId));
                _stores.ReplaceOne(store => store.Id == oldStore.Id, oldStore);
                Store storeIn = _stores.Find(store => store.Id == stockIn.StoreId).FirstOrDefault();
                storeIn.Stocks.Add(stockIn);
                _stores.ReplaceOne(store => store.Id == storeIn.Id, storeIn);
                // Update Product
                Product oldProduct = _products.Find(product => product.ProductId == oldStock.ProductId).FirstOrDefault();
                oldProduct.Stocks.Remove(oldProduct.Stocks.First(stock => stock.StockId == oldStock.StockId));
                _products.ReplaceOne(product => product.ProductId == oldProduct.ProductId, oldProduct);
                Product productIn = _products.Find(product => product.ProductId == stockIn.ProductId).FirstOrDefault();
                productIn.Stocks.Add(stockIn);
                _products.ReplaceOne(product => product.ProductId == productIn.ProductId, productIn);
            }
            _stocks.ReplaceOne(stock => stock.StockId == id, stockIn);
        }

        public void RemoveStock(Stock stockIn)
        {
            if (stockIn.StoreId != null)
            {
                Store storeIn = _stores.Find(store => store.Id == stockIn.StoreId).FirstOrDefault();
                storeIn.Stocks.Remove(storeIn.Stocks.First(stock => stock.StockId == stockIn.StockId));
                _stores.ReplaceOne(store => store.Id == storeIn.Id, storeIn);
            }
            if (stockIn.ProductId != "")
            {
                Product productIn = _products.Find(product => product.ProductId == stockIn.ProductId).FirstOrDefault();
                productIn.Stocks.Remove(productIn.Stocks.First(stock => stock.StockId == stockIn.StockId));
                _products.ReplaceOne(product => product.ProductId == productIn.ProductId, productIn);
            }
            _stocks.DeleteOne(stock => stock.StockId == stockIn.StockId);
        }

        public void RemoveStock(string id)
        {
            Stock stockIn = _stocks.Find(stock => stock.StockId == id).FirstOrDefault();
            RemoveStock(stockIn);
        }

        //  Sales collection
        public List<Sale> GetSales() =>
            _sales.Find(sale => true).ToList();

        public Sale GetSale(string id) =>
            _sales.Find(sale => sale.SaleId == "").FirstOrDefault();

        public Sale CreateSale(Sale sale)
        {
            _sales.InsertOne(sale);
            if (sale.POSUser != Guid.Empty)
            {
                User userIn = _users.Find(user => user.Id == sale.POSUser).FirstOrDefault();
                userIn.Sales.Add(sale);
                _users.ReplaceOne(user => user.Id == userIn.Id, userIn);
            }
            if (sale.POSnum != "")
            {
                Pos posIn = _pos.Find(pos => pos.PosId == sale.POSnum).FirstOrDefault();
                posIn.Sales.Add(sale);
                _pos.ReplaceOne(pos => pos.PosId == posIn.PosId, posIn);
            }
            return sale;
        }

        public void UpdateSale(string id, Sale saleIn)
        {
            Sale oldSale = _sales.Find(sale => sale.SaleId == id).FirstOrDefault();
            saleIn.SaleId = oldSale.SaleId;
            if ((saleIn.POSUser != oldSale.POSUser && saleIn.POSUser != Guid.Empty) || (saleIn.POSnum != oldSale.POSnum && saleIn.POSnum != ""))
            {
                //  Update User
                User oldUser = _users.Find(user => user.Id == oldSale.POSUser).FirstOrDefault();
                oldUser.Sales.Remove(oldUser.Sales.First(sale => sale.POSUser == oldUser.Id));
                _users.ReplaceOne(user => user.Id == oldUser.Id, oldUser);
                User userIn = _users.Find(user => user.Id == saleIn.POSUser).FirstOrDefault();
                userIn.Sales.Add(saleIn);
                _users.ReplaceOne(user => user.Id == userIn.Id, userIn);
                // Update Pos
                Pos oldPos = _pos.Find(pos => pos.PosId == oldSale.POSnum).FirstOrDefault();
                oldPos.Sales.Remove(oldPos.Sales.First(sale => sale.SaleId == oldSale.SaleId));
                _pos.ReplaceOne(pos => pos.PosId == oldPos.PosId, oldPos);
                Pos posIn = _pos.Find(pos => pos.PosId == saleIn.POSnum).FirstOrDefault();
                posIn.Sales.Add(saleIn);
                _pos.ReplaceOne(pos => pos.PosId == posIn.PosId, posIn);
            }
            _sales.ReplaceOne(sale => sale.SaleId == id, saleIn);
        }

        public void RemoveSale(Sale saleIn)
        {
            if (saleIn.POSUser != Guid.Empty)
            {
                User userIn = _users.Find(user => user.Id == saleIn.POSUser).FirstOrDefault();
                userIn.Sales.Remove(userIn.Sales.First(sale => sale.POSUser == saleIn.POSUser));
                _users.ReplaceOne(user => user.Id == userIn.Id, userIn);
            }
            if (saleIn.POSnum != "")
            {
                Pos posIn = _pos.Find(pos => pos.PosId == saleIn.POSnum).FirstOrDefault();
                posIn.Sales.Remove(posIn.Sales.First(sale => sale.SaleId == saleIn.SaleId));
                _pos.ReplaceOne(pos => pos.PosId == posIn.PosId, posIn);
            }
            _sales.DeleteOne(sale => sale.SaleId == saleIn.SaleId);
        }

        public void RemoveSale(string id)
        {
            Sale saleIn = _sales.Find(sale => sale.SaleId == id).FirstOrDefault();
            RemoveSale(saleIn);
        }

        //  SalesDetails collection
        public List<SalesDetail> GetSalesDetails() =>
            _salesDetails.Find(detail => true).ToList();

        public SalesDetail GetSalesDetail(string id) =>
            _salesDetails.Find(detail => detail.SalesDetailId == id).FirstOrDefault();

        public SalesDetail CreateSalesDetail(SalesDetail detail)
        {
            _salesDetails.InsertOne(detail);
            if (detail.SaleId != "")
            {
                Sale saleIn = _sales.Find(sale => sale.SaleId == detail.SaleId).FirstOrDefault();
                saleIn.SalesDetails.Add(detail);
                _sales.ReplaceOne(sale => sale.SaleId == saleIn.SaleId, saleIn);
            }
            return detail;
        }

        public void UpdateSalesDetail(string id, SalesDetail detailIn)
        {
            SalesDetail oldDetail = _salesDetails.Find(detail => detail.SalesDetailId == id).FirstOrDefault();
            detailIn.SalesDetailId = oldDetail.SalesDetailId;
            if (detailIn.SaleId != oldDetail.SaleId && detailIn.SaleId != "")
            {
                //  Update Sale
                Sale oldSale = _sales.Find(sale => sale.SaleId == oldDetail.SaleId).FirstOrDefault();
                oldSale.SalesDetails.Remove(oldSale.SalesDetails.First(detail => detail.SalesDetailId == oldDetail.SalesDetailId));
                _sales.ReplaceOne(sale => sale.SaleId == oldSale.SaleId, oldSale);
                Sale saleIn = _sales.Find(sale => sale.SaleId == detailIn.SaleId).FirstOrDefault();
                saleIn.SalesDetails.Add(detailIn);
                _sales.ReplaceOne(sale => sale.SaleId == saleIn.SaleId, saleIn);
            }
            _salesDetails.ReplaceOne(detail => detail.SalesDetailId == id, detailIn);
        }

        public void RemoveSalesDetail(SalesDetail detailIn)
        {
            if (detailIn.SaleId != "")
            {
                Sale saleIn = _sales.Find(sale => sale.SaleId == detailIn.SaleId).FirstOrDefault();
                saleIn.SalesDetails.Remove(saleIn.SalesDetails.First(detail => detail.SalesDetailId == detailIn.SalesDetailId));
                _sales.ReplaceOne(sale => sale.SaleId == saleIn.SaleId, saleIn);
            }
            _salesDetails.DeleteOne(detail => detail.SalesDetailId == detailIn.SalesDetailId);
        }

        public void RemoveSalesDetail(string id)
        {
            SalesDetail detailIn = _salesDetails.Find(detail => detail.SalesDetailId == id).FirstOrDefault();
            RemoveSalesDetail(detailIn);
        }

        //  Products collection
        public List<Product> GetProducts() =>
            _products.Find(product => true).ToList();

        public Product GetProduct(string id) =>
            _products.Find(product => product.ProductId == id).FirstOrDefault();

        public Product CreateProduct(Product product)
        {
            _products.InsertOne(product);
            if (product.FamilyId != "")
            {
                Family familyIn = _families.Find(family => family.FamilyId == product.FamilyId).FirstOrDefault();
                familyIn.Products.Add(product);
                _families.ReplaceOne(family => family.FamilyId == familyIn.FamilyId, familyIn);
            }
            return product;
        }

        public void UpdateProduct(string id, Product productIn)
        {
            Product oldProduct = _products.Find(product => product.ProductId == id).FirstOrDefault();
            productIn.ProductId = oldProduct.ProductId;
            if (productIn.FamilyId != oldProduct.FamilyId && productIn.FamilyId.Length > 0)
            {
                //  Update Family
                if (oldProduct.FamilyId.Length > 0) { 
                    Family oldFamily = _families.Find(family => family.FamilyId == oldProduct.FamilyId).FirstOrDefault();
                    oldFamily.Products.Remove(oldFamily.Products.First(family => family.FamilyId == oldFamily.FamilyId));
                    _families.ReplaceOne(family => family.FamilyId == oldFamily.FamilyId, oldFamily);
                }
                Family familyIn = _families.Find(family => family.FamilyId == productIn.FamilyId).FirstOrDefault();
                familyIn.Products.Add(productIn);
                _families.ReplaceOne(family => family.FamilyId == familyIn.FamilyId, familyIn);
            }
                _products.ReplaceOne(product => product.ProductId == id, productIn);
        }

        public void RemoveProduct(Product productIn)
        {
            if (productIn.FamilyId != "")
            {
                Family familyIn = _families.Find(family => family.FamilyId == productIn.FamilyId).FirstOrDefault();
                familyIn.Products.Remove(familyIn.Products.First(product => product.ProductId == productIn.ProductId));
                _families.ReplaceOne(family => family.FamilyId == familyIn.FamilyId, familyIn);
            }
            _products.DeleteOne(product => product.ProductId == productIn.ProductId);
        }

        public void RemoveProduct(string id)
        {
            Product productIn = _products.Find(product => product.ProductId == id).FirstOrDefault();
            RemoveProduct(productIn);
        }

        //  Pos collection
        public List<Pos> GetPos() =>
            _pos.Find(pos => true).ToList();

        public Pos GetPos(string id) =>
            _pos.Find(pos => pos.PosId == id).FirstOrDefault();

        public Pos CreatePos(Pos pos)
        {
            _pos.InsertOne(pos);
            if (pos.StoreId != "")
            {
                Store storeIn = _stores.Find(store => store.Id == pos.StoreId).FirstOrDefault();
                storeIn.Pos.Add(pos);
                _stores.ReplaceOne(store => store.Id == storeIn.Id, storeIn);
            }
            return pos;
        }

        public void UpdatePos(string id, Pos posIn)
        {
            Pos oldPos = _pos.Find(pos => pos.PosId == id).FirstOrDefault();
            posIn.PosId = oldPos.PosId;
            if (posIn.StoreId != oldPos.StoreId && posIn.StoreId != "")
            {
                //  Update Store
                Store oldStore = _stores.Find(store => store.Id == oldPos.StoreId).FirstOrDefault();
                oldStore.Pos.Remove(oldStore.Pos.First(pos => pos.PosId == oldPos.PosId));
                _stores.ReplaceOne(store => store.Id == oldStore.Id, oldStore);
                Store storeIn = _stores.Find(store => store.Id == posIn.StoreId).FirstOrDefault();
                storeIn.Pos.Add(posIn);
                _stores.ReplaceOne(store => store.Id == storeIn.Id, storeIn);
            }
            _pos.ReplaceOne(pos => pos.PosId == id, posIn);
        }

        public void RemovePos(Pos posIn)
        {
            if (posIn.StoreId != "")
            {
                Store storeIn = _stores.Find(store => store.Id == posIn.StoreId).FirstOrDefault();
                storeIn.Pos.Remove(storeIn.Pos.First(pos => pos.PosId == posIn.PosId));
                _stores.ReplaceOne(store => store.Id == storeIn.Id, storeIn);
            }
            _pos.DeleteOne(pos => pos.PosId == posIn.PosId);
        }

        public void RemovePos(string id)
        {
            Pos posIn = _pos.Find(pos => pos.PosId == id).FirstOrDefault();
            RemovePos(posIn);
        }

        //  Payments collection
        public List<Payment> GetPayments() =>
            _payments.Find(payment => true).ToList();

        public Payment GetPayment(string id) =>
            _payments.Find(payment => payment.PaymentId == id).FirstOrDefault();

        public Payment CreatePayment(Payment payment)
        {
            _payments.InsertOne(payment);
            if (payment.SaleId != "")
            {
                Sale saleIn = _sales.Find(sale => sale.SaleId == payment.SaleId).FirstOrDefault();
                saleIn.Payments.Add(payment);
                _sales.ReplaceOne(sale => sale.SaleId == saleIn.SaleId, saleIn);
            }
            if (payment.PaymentTypeId != "")
            {
                PaymentType typeIn = _paymentTypes.Find(type => type.PaymentTypeId == payment.PaymentTypeId).FirstOrDefault();
                typeIn.Payments.Add(payment);
                _paymentTypes.ReplaceOne(type => type.PaymentTypeId == typeIn.PaymentTypeId, typeIn);
            }
            return payment;
        }

        public void UpdatePayment(string id, Payment paymentIn)
        {
            Payment oldPayment = _payments.Find(payment => payment.PaymentId == id).FirstOrDefault();
            paymentIn.PaymentId = oldPayment.PaymentId;
            if ((paymentIn.SaleId != oldPayment.SaleId && paymentIn.SaleId != "") || (paymentIn.PaymentTypeId != oldPayment.PaymentTypeId && paymentIn.PaymentTypeId != ""))
            {
                //  Update Sale
                Sale oldSale = _sales.Find(sale => sale.SaleId == oldPayment.SaleId).FirstOrDefault();
                oldSale.Payments.Remove(oldSale.Payments.First(payment => payment.PaymentId == oldPayment.PaymentId));
                _sales.ReplaceOne(sale => sale.SaleId == oldSale.SaleId, oldSale);
                Sale saleIn = _sales.Find(sale => sale.SaleId == paymentIn.SaleId).FirstOrDefault();
                saleIn.Payments.Add(paymentIn);
                _sales.ReplaceOne(sale => sale.SaleId == saleIn.SaleId, saleIn);
                //  Update PaymentType
                PaymentType oldType = _paymentTypes.Find(type => type.PaymentTypeId == oldPayment.PaymentTypeId).FirstOrDefault();
                oldType.Payments.Remove(oldType.Payments.First(payment => payment.PaymentId == oldPayment.PaymentId));
                _paymentTypes.ReplaceOne(type => type.PaymentTypeId == oldType.PaymentTypeId, oldType);
                PaymentType typeIn = _paymentTypes.Find(type => type.PaymentTypeId == paymentIn.PaymentTypeId).FirstOrDefault();
                typeIn.Payments.Add(paymentIn);
                _paymentTypes.ReplaceOne(type => type.PaymentTypeId == typeIn.PaymentTypeId, typeIn);
            }
            _payments.ReplaceOne(payment => payment.PaymentId == id, paymentIn);
        }

        public void RemovePayment(Payment paymentIn)
        {
            if (paymentIn.SaleId != "")
            {
                Sale saleIn = _sales.Find(sale => sale.SaleId == paymentIn.SaleId).FirstOrDefault();
                saleIn.Payments.Remove(saleIn.Payments.First(payment => payment.PaymentId == paymentIn.PaymentId));
                _sales.ReplaceOne(sale => sale.SaleId == saleIn.SaleId, saleIn);
            }
            if (paymentIn.PaymentTypeId != "")
            {
                PaymentType typeIn = _paymentTypes.Find(type => type.PaymentTypeId == paymentIn.PaymentTypeId).FirstOrDefault();
                typeIn.Payments.Remove(typeIn.Payments.First(payment => payment.PaymentId == paymentIn.PaymentId));
                _paymentTypes.ReplaceOne(type => type.PaymentTypeId == typeIn.PaymentTypeId, typeIn);
            }
            _payments.DeleteOne(payment => payment.PaymentId == paymentIn.PaymentId);
        }

        public void RemovePayment(string id)
        {
            Payment paymentIn = _payments.Find(payment => payment.PaymentId == id).FirstOrDefault();
            RemovePayment(paymentIn);
        }

        //  PaymentTypes collection
        public List<PaymentType> GetPaymentTypes() =>
            _paymentTypes.Find(paymentType => true).ToList();

        public PaymentType GetPaymentType(string id) =>
            _paymentTypes.Find(paymentType => paymentType.PaymentTypeId == id).FirstOrDefault();

        public PaymentType CreatePaymentType(PaymentType paymentType)
        {
            _paymentTypes.InsertOne(paymentType);
            return paymentType;
        }

        public void UpdatePaymentType(string id, PaymentType paymentTypeIn)
        {
            var oldPaymentType = _paymentTypes.Find(paymentType => paymentType.PaymentTypeId == id).FirstOrDefault();
            paymentTypeIn.PaymentTypeId = oldPaymentType.PaymentTypeId;
            _paymentTypes.ReplaceOne(paymentType => paymentType.PaymentTypeId == id, paymentTypeIn);
        }

        public void RemovePaymentType(PaymentType paymentTypeIn) =>
            _paymentTypes.DeleteOne(paymentType => paymentType.PaymentTypeId == paymentTypeIn.PaymentTypeId);

        public void RemovePaymentType(string id) =>
            _paymentTypes.DeleteOne(paymentType => paymentType.PaymentTypeId == id);

        //  Families collection
        public List<Family> GetFamilies() =>
            _families.Find(family => true).ToList();

        public Family GetFamily(string id) =>
            _families.Find(family => family.FamilyId == id).FirstOrDefault();

        public Family CreateFamily(Family family)
        {
            _families.InsertOne(family);
            return family;
        }

        public void UpdateFamily(string id, Family familyIn)
        {
            var oldFamily = _families.Find(family => family.FamilyId == id).FirstOrDefault();
            familyIn.FamilyId = oldFamily.FamilyId;
            _families.ReplaceOne(family => family.FamilyId == id, familyIn);
        }

        public void RemoveFamily(Family familyIn) =>
            _families.DeleteOne(family => family.FamilyId == familyIn.FamilyId);

        public void RemoveFamily(string id) =>
            _families.DeleteOne(family => family.FamilyId == id);

        //  Photos collection
        public List<Photo> GetPhotos() =>
            _photos.Find(photo => true).ToList();

        public Photo GetPhoto(string id) =>
            _photos.Find(photo => photo.Id == id).FirstOrDefault();

        public Photo CreatePhoto(Photo photo)
        {
            _photos.InsertOne(photo);
            if (photo.UserId != Guid.Empty)
            {
                User userIn = _users.Find(user => user.Id == photo.UserId).FirstOrDefault();
                userIn.Photos.Add(photo);
                _users.ReplaceOne(user => user.Id == userIn.Id, userIn);
            }
            if (photo.ProductId != "")
            {
                Product productIn = _products.Find(product => product.ProductId == photo.ProductId).FirstOrDefault();
                productIn.Photos.Add(photo);
                _products.ReplaceOne(product => product.ProductId == productIn.ProductId, productIn);
            }
            return photo;
        }

        public void UpdatePhoto(string id, Photo photoIn)
        {
            Photo oldPhoto = _photos.Find(photo => photo.Id == id).FirstOrDefault();
            photoIn.Id = oldPhoto.Id;
            if (photoIn.UserId != Guid.Empty)
            {
                if (photoIn.UserId != oldPhoto.UserId) 
                { 
                    //  Update User
                    User oldUser = _users.Find(user => user.Id == oldPhoto.UserId).FirstOrDefault();
                    oldUser.Photos.Remove(oldUser.Photos.First(photo => photo.Id == oldPhoto.Id));
                    _users.ReplaceOne(user => user.Id == oldUser.Id, oldUser);
                    User userIn = _users.Find(user => user.Id == photoIn.UserId).FirstOrDefault();
                    userIn.Photos.Add(photoIn);
                    _users.ReplaceOne(user => user.Id == userIn.Id, userIn);
                } else
                {
                    //  Update User
                    User oldUser = _users.Find(user => user.Id == oldPhoto.UserId).FirstOrDefault();
                    oldUser.Photos.Remove(oldUser.Photos.First(photo => photo.Id == oldPhoto.Id));
                    oldUser.Photos.Add(photoIn);
                    _users.ReplaceOne(user => user.Id == oldUser.Id, oldUser);
                }
            }
            if (photoIn.ProductId != oldPhoto.ProductId && photoIn.ProductId != "")
            {
                if (photoIn.ProductId != oldPhoto.ProductId) 
                { 
                    //  Update Product
                    Product oldProduct = _products.Find(product => product.ProductId == oldPhoto.ProductId).FirstOrDefault();
                    oldProduct.Photos.Remove(oldProduct.Photos.First(photo => photo.Id == oldPhoto.Id));
                    _products.ReplaceOne(product => product.ProductId == oldProduct.ProductId, oldProduct);
                    Product productIn = _products.Find(product => product.ProductId == photoIn.ProductId).FirstOrDefault();
                    productIn.Photos.Add(photoIn);
                    _products.ReplaceOne(product => product.ProductId == productIn.ProductId, productIn);
                }else
                {
                    //  Update Product
                    Product oldProduct = _products.Find(product => product.ProductId == oldPhoto.ProductId).FirstOrDefault();
                    oldProduct.Photos.Remove(oldProduct.Photos.First(photo => photo.Id == oldPhoto.Id));
                    oldProduct.Photos.Add(photoIn);
                    _products.ReplaceOne(product => product.ProductId == oldProduct.ProductId, oldProduct);
                }
            }
            _photos.ReplaceOne(photo => photo.Id == id, photoIn);
        }

        public void RemovePhoto(Photo photoIn)
        {
            if (photoIn.UserId != Guid.Empty)
            {
                User userIn = _users.Find(user => user.Id == photoIn.UserId).FirstOrDefault();
                userIn.Photos.Remove(userIn.Photos.First(photo => photo.Id == photoIn.Id));
                _users.ReplaceOne(user => user.Id == userIn.Id, userIn);
            }
            if (photoIn.ProductId != "")
            {
                Product productIn = _products.Find(product => product.ProductId == photoIn.ProductId).FirstOrDefault();
                productIn.Photos.Remove(productIn.Photos.First(photo => photo.Id == photoIn.Id));
                _products.ReplaceOne(product => product.ProductId == productIn.ProductId, productIn);
            }
            _photos.DeleteOne(photo => photo.Id == photoIn.Id);
        }

        public void RemovePhoto(string id)
        {
            Photo photoIn = _photos.Find(photo => photo.Id == id).FirstOrDefault();
            RemovePhoto(photoIn);
        }
    }
}
