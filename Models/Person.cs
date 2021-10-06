using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StoreAPI.Models
{
    public class Person
    {
        [BsonIgnore]
        public virtual int Id { get; set; }
        [BsonIgnore]
        public virtual string Name { get; set; }
        [BsonIgnore]
        public virtual string Address { get; set; }
        [BsonIgnore]
        public virtual string City { get; set; }
        [BsonIgnore]
        public virtual string Email { get; set; }
    }
}
