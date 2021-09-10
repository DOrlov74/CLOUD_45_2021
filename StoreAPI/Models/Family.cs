using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StoreAPI.Models
{
    public class Family
    {
        public Family()
        {
            Products = new HashSet<Product>();
        }

        [BsonId]
        [StringLength(5)]
        public string FamilyId { get; set; }

        [StringLength(50)]
        public string FamilyName { get; set; }

        public virtual ICollection<Product> Products { get; set; }
    }
}
