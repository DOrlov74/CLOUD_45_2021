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
    public class Product
    {
        public Product()
        {
            Stocks = new HashSet<Stock>();
        }

        [BsonId]
        public int ProductId { get; set; }

        [StringLength(12)]
        public string Barcode { get; set; }

        [BsonRequired]
        [StringLength(50)]
        public string ProductName { get; set; }

        [BsonRequired]
        [StringLength(5)]
        [ForeignKey("Family")]
        public string FamilyId { get; set; }

        [StringLength(50)]
        public string UnitMeasure { get; set; }

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal QtyPerUnit { get; set; }

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal UnitPrice { get; set; }

        public bool? Discontinued { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local, Representation = BsonType.Document)]
        public DateTime? DateCreated { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local, Representation = BsonType.Document)]
        public DateTime? DateModified { get; set; }

        public virtual Family Family { get; set; }

        public virtual ICollection<Stock> Stocks { get; set; }
    }
}
