using System.Net.Http;
using System.Threading.Tasks;

using Altinn.Authorization.ABAC.Xacml;
using Altinn.Authorization.ABAC.Xacml.JsonProfile;
using Altinn.Platform.Authorization.IntegrationTests.Fixtures;
using Altinn.Platform.Authorization.IntegrationTests.Util;
using Xunit;

namespace Altinn.Platform.Authorization.IntegrationTests
{
    public class Hap_DecisionTests :IClassFixture<PlatformAuthorizationHapFixture>
    { 
        private readonly PlatformAuthorizationHapFixture _fixture;

        public Hap_DecisionTests(PlatformAuthorizationHapFixture fixture)
        {
            _fixture = fixture;
        }

        /// <summary>
        /// Test som verifiser at registereier har tilgang til dataproduktadministrasjon.
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task PDP_Decision_Hap01()
        {
            string testCase = "Hap0001";
            HttpClient client = GetTestClient();
            HttpRequestMessage httpRequestMessage = TestSetupUtil.CreateJsonProfileXacmlRequest(testCase);
            XacmlJsonResponse expected = TestSetupUtil.ReadExpectedJsonProfileResponse(testCase);

            // Act
            XacmlJsonResponse contextResponse = await TestSetupUtil.GetXacmlJsonProfileContextResponseAsync(client, httpRequestMessage);

            // Assert
            AssertionUtil.AssertEqual(expected, contextResponse);
        }

        /// <summary>
        /// Test som verifiser at registereier har tilgang til dataproduktadministrasjon.
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task PDP_Decision_Hap02()
        {
            string testCase = "Hap0002";
            HttpClient client = GetTestClient();
            HttpRequestMessage httpRequestMessage = TestSetupUtil.CreateJsonProfileXacmlRequest(testCase);
            XacmlJsonResponse expected = TestSetupUtil.ReadExpectedJsonProfileResponse(testCase);

            // Act
            XacmlJsonResponse contextResponse = await TestSetupUtil.GetXacmlJsonProfileContextResponseAsync(client, httpRequestMessage);

            // Assert
            AssertionUtil.AssertEqual(expected, contextResponse);
        }

        /// <summary>
        /// Test som verifiser at forsker har tilgang til kohortutforsker
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task PDP_Decision_Hap03()
        {
            string testCase = "Hap0003";
            HttpClient client = GetTestClient();
            HttpRequestMessage httpRequestMessage = TestSetupUtil.CreateJsonProfileXacmlRequest(testCase);
            XacmlJsonResponse expected = TestSetupUtil.ReadExpectedJsonProfileResponse(testCase);

            // Act
            XacmlJsonResponse contextResponse = await TestSetupUtil.GetXacmlJsonProfileContextResponseAsync(client, httpRequestMessage);

            // Assert
            AssertionUtil.AssertEqual(expected, contextResponse);
        }

        /// <summary>
        /// Test som verifiser at registereier ikke har tilgang til kohortutforsker.
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task PDP_Decision_Hap04()
        {
            string testCase = "Hap0004";
            HttpClient client = GetTestClient();
            HttpRequestMessage httpRequestMessage = TestSetupUtil.CreateJsonProfileXacmlRequest(testCase);
            XacmlJsonResponse expected = TestSetupUtil.ReadExpectedJsonProfileResponse(testCase);

            // Act
            XacmlJsonResponse contextResponse = await TestSetupUtil.GetXacmlJsonProfileContextResponseAsync(client, httpRequestMessage);

            // Assert
            AssertionUtil.AssertEqual(expected, contextResponse);
        }

        private HttpClient GetTestClient()
        {
            return _fixture.GetClient();
        }
    }
}
