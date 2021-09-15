using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StoreAPI.Models
{
    public class CloudinarySettings: ICloudinarySettings
    {
        public string CloudName { get; set; }
        public string ApiKey { get; set; }
        public string ApiSecret { get; set; }
    }

    public interface ICloudinarySettings
    {
        string CloudName { get; set; }
        string ApiKey { get; set; }
        string ApiSecret { get; set; }
    }
}
