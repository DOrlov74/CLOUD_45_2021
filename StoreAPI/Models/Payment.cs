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
    public class Payment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string PaymentId { get; set; }

        [StringLength(50)]
        //public string SalesNumDoc { get; set; }
        [ForeignKey("Sale")]
        public string SaleId { get; set; }

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal PaidValue { get; set; }


        [ForeignKey("PaymentType")]
        public string PaymentTypeId { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local, Representation = BsonType.Document)]
        public DateTime? CreatedDate { get; set; }

        [StringLength(5)]
        public string Store { get; set; }

        [BsonIgnore]
        public virtual Sale Sale { get; set; }

        [BsonIgnore]
        public virtual PaymentType PaymentType { get; set; }
    }
}
