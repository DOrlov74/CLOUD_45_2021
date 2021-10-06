using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StoreAPI.Models
{
    public class PaymentType
    {
        public PaymentType()
        {
            Payments = new HashSet<Payment>();
        }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string PaymentTypeId { get; set; }

        [StringLength(20)]
        public string PaymentTypeName { get; set; }

        public virtual ICollection<Payment> Payments { get; set; }
    }
}
