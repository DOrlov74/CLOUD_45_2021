using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StoreAPI.Models
{
    public class DatabaseSettings:IDatabaseSettings
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public class CollectionNames : ICollectionNames
    {
        public string StoresCollection { get; set; }
        public string UsersCollection { get; set; }
        public string StocksCollection { get; set; }
        public string SalesCollection { get; set; }
        public string SalesDetailsCollection { get; set; }
        public string ProductsCollection { get; set; }
        public string PosCollection { get; set; }
        public string PaymentsCollection { get; set; }
        public string PaymentTypesCollection { get; set; }
        public string FamiliesCollection { get; set; }
        public string PhotosCollection { get; set; }
    }

    public interface IDatabaseSettings
    {
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }

    public interface ICollectionNames
    {
        string StoresCollection { get; set; }
        string UsersCollection { get; set; }
        string StocksCollection { get; set; }
        string SalesCollection { get; set; }
        string SalesDetailsCollection { get; set; }
        string ProductsCollection { get; set; }
        string PosCollection { get; set; }
        string PaymentsCollection { get; set; }
        string PaymentTypesCollection { get; set; }
        string FamiliesCollection { get; set; }
        string PhotosCollection { get; set; }
    }
}
