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
    public class Pos
    {
        public Pos()
        {
            Sales = new HashSet<Sale>();
        }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string PosId { get; set; }

        [BsonRequired]
        [StringLength(5)]
        [ForeignKey("Store")]
        public string StoreId { get; set; }

        [StringLength(25)]
        public string StoreLocation { get; set; }

        [BsonIgnore]
        public virtual Store Store { get; set; }

        public virtual ICollection<Sale> Sales { get; set; }
    }
}
