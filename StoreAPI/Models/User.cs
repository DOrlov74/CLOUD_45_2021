using AspNetCore.Identity.MongoDbCore.Models;
using MongoDB.Bson.Serialization.Attributes;
using MongoDbGenericRepository.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StoreAPI.Models
{
    [CollectionName("Users")]
    public class User:MongoIdentityUser<Guid>
    {
        public User()
        {
            Sales = new HashSet<Sale>();
        }

        //[BsonId]

        //public int Id { get; set; }

        //[BsonRequired]
        //[MaxLength(60)]
        //public string Name { get; set; }
        [BsonElement("Address")]
        [MaxLength(120)]
        public string Address { get; set; }
        [BsonElement("City")]
        [MaxLength(60)]
        public string City { get; set; }
        //[BsonElement("Email")]
        //[MaxLength(50)]
        //public string Email { get; set; }

        //[BsonRequired]
        [StringLength(9)]
        public string Phone { get; set; }

        [BsonRequired]
        [StringLength(25)]
        public string Password { get; set; }

        public string Token { get; set; }

        public virtual ICollection<Sale> Sales { get; set; } 
    }
}
