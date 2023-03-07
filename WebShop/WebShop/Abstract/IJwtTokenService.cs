using Google.Apis.Auth;
using WebShop.Data.Entities.Identity;

namespace WebShop.Abstract
{
    public interface IJwtTokenService
    {
        Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string tokenId);
        Task<string> CreateToken(UserEntity user);
    }
}
