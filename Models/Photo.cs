using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace StoreAPI.Models
{
    public class Photo
    {
        [BsonId]
        public string Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        [ForeignKey("User")]
        public Guid UserId { get; set; }
        [ForeignKey("Product")]
        public string ProductId { get; set; }
    }
}
