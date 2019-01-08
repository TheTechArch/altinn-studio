/*
 * Gitea API.
 *
 * This documentation describes the Gitea API.
 *
 * OpenAPI spec version: 1.1.1
 *
 * Generated by: https://github.com/swagger-api/swagger-codegen.git
 */
using System.IO;
using System.Runtime.Serialization;
using Newtonsoft.Json;

namespace AltinnCore.RepositoryClient.Model
{
    /// <summary>
    /// CreateRepoOption options when creating repository
    /// </summary>
    [DataContract]
    public partial class CreateAccessTokenOption
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CreateAccessTokenOption" /> class.
        /// </summary>
        [JsonConstructorAttribute]
        protected CreateAccessTokenOption()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CreateAccessTokenOption" /> class.
        /// </summary>
        /// <param name="Name">Name of the repository to create (required).</param>
        public CreateAccessTokenOption(string Name = default(string))
        {
            // to ensure "Name" is required (not null)
            if (Name == null)
            {
                throw new InvalidDataException("Name is a required property for CreateRepoOption and cannot be null");
            }
            else
            {
                this.Name = Name;
            }
        }
        
        /// <summary>
        /// Name of the repository to create
        /// </summary>
        [DataMember(Name="name", EmitDefaultValue=false)]
        public string Name { get; set; }
    }
}