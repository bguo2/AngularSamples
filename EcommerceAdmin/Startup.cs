using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(EcommerceAdmin.Startup))]
namespace EcommerceAdmin
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
