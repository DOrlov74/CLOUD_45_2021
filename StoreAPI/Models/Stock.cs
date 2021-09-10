using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace StoreAPI.Models
{
    public class Stock
    {
        [BsonId]
        public int StockId { get; set; }

        [ForeignKey("Product")]
        public int ProductId { get; set; }

        [StringLength(5)]
        [ForeignKey("Store")]
        public string StoreId { get; set; }

        public int Quantity { get; set; }

        public int QuantityBase { get; set; }

        [StringLength(20)]
        public string SaleUnit { get; set; }

        public int? QtySaleUnit { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local, Representation = BsonType.Document)]
        public DateTime? ModifiedDate { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local, Representation = BsonType.Document)]
        public DateTime? CreatedDate { get; set; }

        [BsonIgnore]
        public virtual Product tblProduct { get; set; }

        [BsonIgnore]
        public virtual Store tblStore { get; set; }
    }
}
