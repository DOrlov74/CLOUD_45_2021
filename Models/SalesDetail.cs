using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoreAPI.Models
{
    public class SalesDetail
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string SalesDetailId { get; set; }

        [ForeignKey("Sale")]
        public string SaleId { get; set; }

        public int Seq { get; set; }

        public string Product { get; set; }

        public int Quantity { get; set; }

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal UnitPrice { get; set; }

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal LineTotal { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local, Representation = BsonType.Document)]
        public DateTime? DateCreated { get; set; }

        [BsonIgnore]
        public virtual Sale Sale { get; set; }
    }
}