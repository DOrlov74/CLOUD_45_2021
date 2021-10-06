using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace StoreAPI.Models
{
    public class Store
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("name")]
        [Required(ErrorMessage = "Store name is required")]
        public string StoreName { get; set; }

        [BsonElement("address")]
        [Required(ErrorMessage = "Store address is required")]
        public string StoreAddress { get; set; }

        public bool? Active { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local, Representation = BsonType.Document)]
        public DateTime? ModifiedDate { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local, Representation = BsonType.Document)]
        public DateTime? CreatedDate { get; set; }

        public virtual ICollection<Pos> Pos { get; set; } = new List<Pos>();

        public virtual ICollection<Stock> Stocks { get; set; } = new List<Stock>();
    }
}
