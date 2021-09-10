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
    public class Sale
    {
        public Sale()
        {
            SalesDetails = new HashSet<SalesDetail>();
        }

        [BsonId]
        public int SaleId { get; set; }

        [StringLength(20)]
        public string SaleDocNum { get; set; }

        [StringLength(5)]
        public string Store { get; set; }

        [ForeignKey("POS")]
        public int POSnum { get; set; }

        [ForeignKey("User")]
        public int POSUser { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local, Representation = BsonType.Document)]
        public DateTime? DateCreated { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local, Representation = BsonType.Document)]
        public DateTime? Datemodified { get; set; }

        public bool? Paid { get; set; }

        public int CUstomer { get; set; }

        [BsonIgnore]
        public virtual Pos Pos { get; set; }

        public virtual ICollection<SalesDetail> SalesDetails { get; set; }

        [BsonIgnore]
        public virtual User User { get; set; }

        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
