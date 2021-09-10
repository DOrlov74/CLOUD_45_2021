using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StoreAPI.Models
{
    public class User:Person
    {
        public User()
        {
            Sales = new HashSet<Sale>();
        }

        [BsonId]

        public override int Id { get => base.Id; set => base.Id = value; }

        [BsonRequired]
        [MaxLength(60)]
        public override string Name { get => base.Name; set => base.Name = value; }
        [BsonElement("Address")]
        [MaxLength(120)]
        public override string Address { get => base.Address; set => base.Address = value; }
        [BsonElement("City")]
        [MaxLength(60)]
        public override string City { get => base.City; set => base.City = value; }
        [BsonElement("Email")]
        [MaxLength(50)]
        public override string Email { get => base.Email; set => base.Email = value; }

        [BsonRequired]
        [StringLength(9)]
        public string Phone { get; set; }

        [BsonRequired]
        [StringLength(25)]
        public string Password { get; set; }

        public virtual ICollection<Sale> Sales { get; set; } 
    }
}
