using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StoreAPI.Models
{
    [CollectionName("Roles")]
    public class Role:MongoIdentityRole<Guid>
    {
        [Required]
        public string RoleName { get; set; }
    }
}
